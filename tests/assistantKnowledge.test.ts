import assert from "node:assert/strict";
import test from "node:test";
import { answerMessage } from "../src/features/assistant/chatEngine";
import { programmedAnswers } from "../src/features/assistant/programmedAnswers";
import { createStation } from "./fixtures";
const context = { stations: [createStation({amenities:["coffee","restroom"]})], vehicleRangeKm: 300, batteryPercent: 40, now: new Date("2026-10-23T15:00:00Z") };
const cases: [string, RegExp][] = [
 ["Como funciona a recarga rápida?", /não uma velocidade garantida/], ["O que é kWh?", /medida de energia/], ["Quanto custa carregar rápido?", /Não tenho tarifas verificadas/],
 ["Reserve um carregador rápido", /não reservar ou agendar/], ["Posso pagar no PIX?", /não processa pagamentos/],
 ["O que é CCS2?", /não confirma compatibilidade elétrica/], ["Por que a reserva de 5%?", /valor exato antes de arredondar/],
 ["Como favoritar uma estação?", /toque no coração/], ["Onde ficam minhas avaliações?", /não é publicado/],
 ["O Flui funciona offline?", /versão instalada/], ["Não tenho internet", /versão instalada/],
 ["Você me ouve?", /ainda não capturo a sua fala/], ["Você é uma IA generativa?", /Não sou uma IA generativa/],
 ["Qual minha localização real?", /Não recebo a sua posição GPS/], ["Como funciona o Plano B?", /mesmas regras de alcance/],
 ["Como usar o planejador?", /ordem e as estações de parada/], ["Como funcionam os filtros?", /preserva as escolhas/],
 ["Esses postos são reais?", /catálogo desta apresentação é simulado/], ["Essas estações são reais?", /catálogo desta apresentação é simulado/],
 ["Por que carregar até 100%?", /80% como alvo/], ["Como alterar a bateria?", /mensagem na conversa não altera/],
 ["Olá FluIA", /Olá!/], ["Muito obrigada", /Por nada!/],
];
test("base ampliada responde dúvidas sem fabricar ações ou recomendações",()=>{
 assert.ok(programmedAnswers.length >= 20);
 for(const [question,expected] of cases){const response=answerMessage(question,context);assert.match(response.text,expected,question);assert.equal(response.recommendation,undefined,question);assert.equal(response.state,"respondendo",question);}
});
test("reservas, pagamentos e preços não são interpretados como recarga rápida",()=>{
 for(const question of ["Reserve uma recarga rápida", "Quanto custa uma recarga rápida?", "Como pagar uma recarga rápida?"]){const r=answerMessage(question,context);assert.equal(r.recommendation,undefined);assert.doesNotMatch(r.text,/Minha sugestão é/);}
});
test("consulta de bateria usa valores atuais sem alterar contexto ou ler números de uma mensagem",()=>{
 const before=JSON.stringify(context),r=answerMessage("Qual é a minha bateria?",context);assert.match(r.text,/40%/);assert.match(r.text,/300 km/);assert.match(r.text,/120 km, antes da reserva de 5%/);assert.equal(JSON.stringify(context),before);
 const other=answerMessage("Qual minha autonomia atual?",{...context,batteryPercent:20,vehicleRangeKm:200});assert.match(other.text,/40 km, antes da reserva/);
 for(const patch of [{batteryPercent:NaN},{batteryPercent:-1},{vehicleRangeKm:0}])assert.equal(answerMessage("Qual minha bateria?",{...context,...patch}).state,"aviso");
 answerMessage("Estou com 10% de bateria",context);assert.equal(context.batteryPercent,40);
});
test("contagem descreve apenas estações recebidas e atende singular, plural e zero",()=>{
 for(const count of [0,1,2]){const r=answerMessage("Quantas estações tem no mapa?",{...context,stations:Array.from({length:count},()=>createStation())});assert.match(r.text,new RegExp(`Recebi ${count} `));assert.match(r.text,/diferente do catálogo completo/);assert.equal(r.recommendation,undefined);}
});
test("educação continua disponível com catálogo vazio ou sem bateria viável",()=>{
 for(const [question,expected]of cases){const response=answerMessage(question,{...context,stations:[],batteryPercent:0});assert.match(response.text,expected,question);assert.equal(response.recommendation,undefined);}
});
test("limites de palavras não transformam cafeína ou pagamento em recomendação de café",()=>{
 for(const q of ["cafeína", "Me diga o clima", "Qual a capital da França?"]){const r=answerMessage(q,context);assert.match(r.text,/Não tenho uma resposta preparada/);assert.equal(r.recommendation,undefined);}
 for(const q of ["Não quero café", "Não preciso de recarga rápida"]){assert.equal(answerMessage(q,context).state,"aviso");}
});
