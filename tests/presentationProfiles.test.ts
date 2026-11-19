import assert from "node:assert/strict";
import test from "node:test";
import { getPresentationProfileState, presentationProfiles } from "../src/features/presentation/presentationProfiles";
import { normalizePresentationState } from "../src/features/presentation/presentationScenario";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { obterOrigemDemonstrativa } from "../src/data/demonstracao";
import { obterDestinoDemonstrativo } from "../src/data/destinosViagem";
import { planejarViagemNoCatalogo } from "../src/utils/catalogTripPlanner";

test("cada perfil tem uma base completa válida de identidade, veículo, bateria e atividade",()=>{
 for(const p of presentationProfiles){const state=getPresentationProfileState(p.id)!;assert.deepEqual(state,normalizePresentationState(state));assert.equal(state.enabled,true);assert.ok(state.config.driverName);assert.ok(state.config.vehicleName);assert.equal(state.favoriteStationIds.length,3);assert.ok(state.sentReviews.length>=2);assert.ok(state.recentHistory.length>0);for(const r of state.sentReviews){assert.ok(r.comment);assert.equal(r.isSynced,false);assert.ok(state.favoriteStationIds.includes(r.stationId));}}
});
test("reaplicar um perfil restaura sua base e não reutiliza edições da apresentação anterior",()=>{
 const a=getPresentationProfileState("urban")!;a.config.batteryPercent=1;a.favoriteStationIds.length=0;const b=getPresentationProfileState("urban")!;assert.equal(b.config.batteryPercent,70);assert.equal(b.favoriteStationIds.length,3);assert.equal(getPresentationProfileState("travel")!.config.batteryPercent,35);assert.equal(getPresentationProfileState("desconhecido"),null);
});
test("perfil de viagem permite demonstrar múltiplas recargas no RJ",()=>{
 const c=getPresentationProfileState("travel")!.config;const p=planejarViagemNoCatalogo(obterOrigemDemonstrativa(c.demoOriginId),obterDestinoDemonstrativo("cabo-frio"),c.vehicleRangeKm,c.batteryPercent,chargingStations,new Date("2026-10-23T15:00:00Z"));assert.notEqual(p.nivelDeAlcance,"foraDeAlcance");assert.ok(p.paradas.length>=2);assert.ok(p.bateriaChegadaDestinoPercent>=5);
});
