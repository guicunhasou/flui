import assert from "node:assert/strict";
import test from "node:test";
import { answerMessage } from "../src/features/assistant/chatEngine";
import { createStation } from "./fixtures";
const context={stations:[createStation({amenities:["coffee","restroom"]})],vehicleRangeKm:300,batteryPercent:70,now:new Date("2026-10-23T15:00:00Z")};
test("humor e easter eggs são explícitos, determinísticos e não executam ações",()=>{
 for(const [question,match]of [["Conta uma piada",/bastante tensão/],["Piada de programador",/exceção/],["42",/lado nerd/],["Modo turbo",/Turbo só no bom humor/],["Café pra FluIA",/funciono à base de código/],["Easter eggs",/Experimente pedir uma piada/]]as const){const before=JSON.stringify(context),r=answerMessage(question,context);assert.match(r.text,match);assert.equal(r.recommendation,undefined);assert.equal(r.text,answerMessage(question,context).text);assert.equal(JSON.stringify(context),before);}
});
test("menção a piada ou turbo dentro de uma necessidade real não desvia a consulta",()=>{
 for(const q of ["Estou com pouca bateria, conta uma piada","Pouca bateria no modo turbo"]){const r=answerMessage(q,{...context,batteryPercent:0});assert.equal(r.state,"alerta");assert.match(r.text,/não há margem/);assert.doesNotMatch(r.text,/bastante tensão|lado nerd|bom humor/);}
 assert.equal(answerMessage("Preciso de café e banheiro",context).recommendation?.intent,"coffeeAndRestroom");
});
