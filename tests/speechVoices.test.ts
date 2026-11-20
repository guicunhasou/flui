import assert from "node:assert/strict";
import test from "node:test";
import Module, { createRequire } from "node:module";
import {loadSpeechVoices,normalizeSpeechVoiceId,portugueseSpeechVoices,resolveSpeechVoiceIdentifier} from "../src/features/assistant/speechVoices";
const voices=[{identifier:"en",name:"English",language:"en-US"},{identifier:"pt",name:"Portugal",language:"pt-PT"},{identifier:"br",name:"Brasil",language:"pt_BR"},{identifier:"br",name:"Duplicada",language:"pt-BR"}];
test("lista só português, coloca Brasil primeiro e remove duplicações",()=>{assert.deepEqual(portugueseSpeechVoices(voices).map(v=>v.identifier),["br","pt"]);});
test("voz inexistente, erro e padrão não geram seleção inválida",async()=>{
 assert.equal(await resolveSpeechVoiceIdentifier("br",async()=>voices),"br");assert.equal(await resolveSpeechVoiceIdentifier("en",async()=>voices),undefined);assert.equal(await resolveSpeechVoiceIdentifier("removida",async()=>voices),undefined);assert.equal(await resolveSpeechVoiceIdentifier("br",async()=>{throw new Error("indisponível");}),undefined);let loaded=false;assert.equal(await resolveSpeechVoiceIdentifier(null,async()=>{loaded=true;return voices;}),undefined);assert.equal(loaded,false);
});
test("consulta de vozes tem limite de tempo e não prende a interface",async()=>{await assert.rejects(loadSpeechVoices(()=>new Promise(()=>{}),5),/excedeu o tempo/);});
test("identificadores de preferência têm tipo e tamanho limitados",()=>{for(const input of [null,undefined,1,true,{},"","x".repeat(257),"id\u0000"]){assert.equal(normalizeSpeechVoiceId(input),null);}assert.equal(normalizeSpeechVoiceId("  pt-br-test  "),"pt-br-test");});
const memory=new Map<string,string>(),require=createRequire(import.meta.url),path=require.resolve("@react-native-async-storage/async-storage"),bridge=new Module(path);bridge.exports={getItem:async(key:string)=>memory.get(key)??null,setItem:async(key:string,value:string)=>{memory.set(key,value);}};require.cache[path]=bridge;
const{fluiStorage,fluiStorageKeys}=require("../src/storage/fluiStorage.ts") as typeof import("../src/storage/fluiStorage");
test("legado usa voz padrão e escolha persiste preservando bateria e favoritos",async()=>{
 memory.clear();memory.set(fluiStorageKeys.userPreferences,JSON.stringify({batteryPercent:42,fontSize:"large"}));memory.set(fluiStorageKeys.favoriteStationIds,JSON.stringify(["station-01"]));const before=await fluiStorage.getUserPreferences();assert.equal(before.speechVoiceId,null);await fluiStorage.updateUserPreferences({speechVoiceId:"br"});assert.deepEqual(await fluiStorage.getUserPreferences(),{...before,speechVoiceId:"br"});assert.deepEqual(await fluiStorage.getFavoriteStationIds(),["station-01"]);
 const saved=memory.get(fluiStorageKeys.userPreferences),set=bridge.exports.setItem;bridge.exports.setItem=async()=>{throw new Error("falha simulada");};try{await assert.rejects(fluiStorage.updateUserPreferences({speechVoiceId:"pt"}),/falha simulada/);assert.equal(memory.get(fluiStorageKeys.userPreferences),saved);}finally{bridge.exports.setItem=set;}
});
