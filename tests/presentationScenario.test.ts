import assert from "node:assert/strict";
import test from "node:test";
import Module, { createRequire } from "node:module";
import { createPresentationState, normalizePresentationState, resolvePresentationPreferences } from "../src/features/presentation/presentationScenario";
const require = createRequire(import.meta.url), nativePath = require.resolve("@react-native-async-storage/async-storage"), memory = new Map<string,string>();
const nativeModule = new Module(nativePath);nativeModule.exports={getItem:async(key:string)=>memory.get(key)??null,setItem:async(key:string,value:string)=>{memory.set(key,value);}};require.cache[nativePath]=nativeModule;
const { createPresentationStore, presentationStore, presentationActivityStorage, PRESENTATION_STORAGE_KEY } = require("../src/features/presentation/presentationStorage.ts") as typeof import("../src/features/presentation/presentationStorage");
const {fluiStorage,fluiStorageKeys}=require("../src/storage/fluiStorage.ts") as typeof import("../src/storage/fluiStorage");

test("estado desconhecido não ativa cenário; normaliza escolhas sem URIs externas",()=>{
 assert.equal(normalizePresentationState({enabled:true}).enabled,false);
 const s=normalizePresentationState({...createPresentationState(),enabled:"true",config:{driverName:"  Marina  ",profileImage:"https://invalido",vehicleImage:"car2",batteryPercent:999},favoriteStationIds:["station-01","station-01","desconhecida"],sentReviews:[{stationId:"station-01",rating:9}]});
 assert.equal(s.enabled,false);assert.equal(s.config.driverName,"Marina");assert.equal(s.config.profileImage,"profile1");assert.equal(s.config.vehicleImage,"car2");assert.equal(s.config.batteryPercent,100);assert.deepEqual(s.favoriteStationIds,["station-01"]);assert.deepEqual(s.sentReviews,[]);
});
test("publicação ignora cenário salvo ativo; desativação recupera os valores originais",async()=>{
 const base=await fluiStorage.getUserPreferences(),state=createPresentationState();state.enabled=true;state.config.batteryPercent=20;state.config.vehicleRangeKm=200;
 assert.strictEqual(resolvePresentationPreferences(base,state,false),base);assert.equal(resolvePresentationPreferences(base,state,true).batteryPercent,20);assert.equal(resolvePresentationPreferences(base,state,true).fontSize,base.fontSize);assert.equal(base.batteryPercent,70);state.enabled=false;assert.strictEqual(resolvePresentationPreferences(base,state,true),base);
});
test("fila preserva duas edições simultâneas; falha não altera estado e permite recuperação",async()=>{
 let data:unknown=createPresentationState(),fail=false;
 const store=createPresentationStore(async()=>data,async value=>{if(fail)throw new Error("sem armazenamento");data=value;});
 await Promise.all([store.update(s=>({...s,favoriteStationIds:["station-01"]})),store.update(s=>({...s,config:{...s.config,batteryPercent:22}}))]);
 assert.deepEqual((await store.getState()).favoriteStationIds,["station-01"]);assert.equal((await store.getState()).config.batteryPercent,22);
 const before=data;fail=true;await assert.rejects(store.update(s=>({...s,enabled:true})),/sem armazenamento/);assert.strictEqual(data,before);fail=false;await store.update(s=>({...s,enabled:true}));assert.equal((await store.getState()).enabled,true);
});
test("ativar, editar favoritos/avaliação/histórico e sair não altera nenhum registro normal",async()=>{
 memory.clear();await fluiStorage.updateUserPreferences({batteryPercent:43,demoOriginId:"next"});await fluiStorage.saveFavoriteStationIds(["station-02"]);const normal=new Map(memory);
 await presentationStore.update(s=>({...s,enabled:true,config:{...s.config,batteryPercent:20}}));await presentationActivityStorage.toggleFavoriteStationId("station-01");
 await presentationActivityStorage.addSentReview({stationId:"station-01",stationName:"será normalizado",rating:4,quality:4,cleaning:4,availability:4,amenities:4,comment:"Cenário de apresentação",wouldReturn:true,recommend:true});
 await presentationActivityStorage.addRecentHistory({stationId:"station-01",stationName:"nome",address:"endereço",action:"viewed_station"});
 const state=await presentationStore.getState();assert.deepEqual(state.favoriteStationIds,["station-01"]);assert.equal(state.sentReviews.length,1);assert.equal(state.recentHistory.length,1);assert.equal(state.sentReviews[0].isSynced,false);
 await presentationStore.update(s=>({...s,enabled:false}));for(const [key,value] of normal)assert.equal(memory.get(key),value);assert.equal(memory.size,normal.size+1);assert.ok(memory.has(PRESENTATION_STORAGE_KEY));assert.equal(memory.get(fluiStorageKeys.sentReviews),undefined);
});
test("falha de leitura não é tratada como cenário vazio para sobrescrita",async()=>{
 let wrote=false;const store=createPresentationStore(async()=>{throw new Error("leitura falhou");},async()=>{wrote=true;});await assert.rejects(store.update(s=>({...s,enabled:true})),/leitura falhou/);assert.equal(wrote,false);
});


test("avaliação/histórico inválidos são rejeitados antes de substituir o cenário salvo",async()=>{
 memory.clear();const input={stationId:"station-01",stationName:"cenário",rating:4,quality:4,cleaning:4,availability:4,amenities:4,comment:"Preservar",wouldReturn:true,recommend:true};
 await presentationActivityStorage.addSentReview(input);await presentationActivityStorage.addRecentHistory({stationId:"station-01",stationName:"nome",address:"endereço",action:"viewed_station"});const before=memory.get(PRESENTATION_STORAGE_KEY);
 await assert.rejects(presentationActivityStorage.addSentReview({...input,rating:9}),/inválida/);assert.equal(memory.get(PRESENTATION_STORAGE_KEY),before);
 await assert.rejects(presentationActivityStorage.addRecentHistory({stationId:"desconhecida",stationName:"nome",address:"endereço",action:"viewed_station"}),/inválido/);assert.equal(memory.get(PRESENTATION_STORAGE_KEY),before);
});
