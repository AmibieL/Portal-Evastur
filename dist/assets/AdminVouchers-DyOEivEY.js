import{r as p,y as k,j as e,p as w,x as C,M as A,b as E,U as P,S as B,ad as O}from"./index-QW8FjDO9.js";import{T as _}from"./ticket-tdyR4fRv.js";import{R as U}from"./refresh-cw-BZ7KxQED.js";import{S as F}from"./search-DazfV-ur.js";import{C as $}from"./circle-check-8z_idqHZ.js";import{C as D}from"./circle-x-C4e7A95o.js";import{P as M}from"./package-DUMflGMe.js";import{E as I}from"./eye-06PydAAl.js";import{D as T}from"./download-B3oK_7BJ.js";function R(s){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(s)}function H(s){return s?new Date(s+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"}):"—"}function G(s){return new Date(s).toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function j(s){const g=s.package_inclusions||[],u=g.length>0?g.map(o=>`<tr><td style="padding:6px 12px;font-size:14px;color:#374151;">✓ ${o}</td></tr>`).join(""):'<tr><td style="padding:6px 12px;font-size:14px;color:#9ca3af;">Consulte o pacote para detalhes</td></tr>',b=s.travel_date?new Date(s.travel_date+"T12:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"}):"A definir",d=s.route_info;let h="";if(d&&typeof d=="object"){const o=d.departure,n=d.return,a=o&&(o.from||o.to),m=n&&(n.from||n.to);if(a||m){const f=r=>{if(!r)return"";const x=r.split("-");return`${x[2]}/${x[1]}/${x[0]}`};let c="";if(a){const r=[o.date?f(o.date):"",o.time?`${o.time}h`:""].filter(Boolean).join(" • ");c+=`<tr><td style="padding:8px 12px;font-size:13px;"><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#6366f1;color:#fff;text-align:center;line-height:20px;font-size:10px;font-weight:700;margin-right:8px;">→</span><span style="color:#312e81;font-weight:600;">IDA</span></td><td style="padding:8px 12px;font-size:13px;color:#0f172a;font-weight:600;">${o.from||""} → ${o.to||""}</td><td style="padding:8px 12px;font-size:12px;color:#64748b;">${r}</td></tr>`}if(m){const r=[n.date?f(n.date):"",n.time?`${n.time}h`:""].filter(Boolean).join(" • ");c+=`<tr><td style="padding:8px 12px;font-size:13px;"><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:#059669;color:#fff;text-align:center;line-height:20px;font-size:10px;font-weight:700;margin-right:8px;">←</span><span style="color:#065f46;font-weight:600;">VOLTA</span></td><td style="padding:8px 12px;font-size:13px;color:#0f172a;font-weight:600;">${n.from||""} → ${n.to||""}</td><td style="padding:8px 12px;font-size:12px;color:#64748b;">${r}</td></tr>`}h=`<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;"><tr style="background:#eef2ff;"><td colspan="3" style="padding:14px 16px;border-bottom:1px solid #e5e7eb;"><span style="color:#4338ca;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">✈️ Trajeto</span></td></tr><tr style="background:#f8fafc;border-bottom:1px solid #e5e7eb;"><td style="padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;width:90px;">Trecho</td><td style="padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Rota</td><td style="padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Data / Horário</td></tr>${c}</table>`}}return`<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Voucher ${s.voucher_code}</title>
<style>@media print{body{background:#fff!important}}</style>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="max-width:640px;margin:0 auto;padding:24px;">
  <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0c4a6e 100%);padding:32px 32px 28px;text-align:center;">
      <div style="margin-bottom:16px;">
        <span style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:8px;padding:8px 16px;">
          <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:1px;">EVASTUR</span>
          <span style="color:rgba(255,255,255,0.6);font-size:11px;display:block;letter-spacing:3px;margin-top:2px;">VIAGENS & TURISMO</span>
        </span>
      </div>
      <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:12px 0 4px;">VOUCHER DE VIAGEM</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">Documento de confirmação de reserva</p>
      <div style="margin-top:20px;display:inline-block;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:10px 24px;">
        <span style="color:rgba(255,255,255,0.6);font-size:11px;text-transform:uppercase;letter-spacing:2px;display:block;">Código do Voucher</span>
        <span style="color:#38bdf8;font-size:22px;font-weight:800;letter-spacing:3px;">${s.voucher_code}</span>
      </div>
    </div>
    <div style="padding:32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="padding:12px 16px;background:#f0f9ff;border-radius:10px;">
            <span style="color:#0369a1;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Passageiro</span>
            <br><span style="color:#0f172a;font-size:18px;font-weight:700;">${s.client_name}</span>
            ${s.client_email?`<br><span style="color:#64748b;font-size:13px;">${s.client_email}</span>`:""}
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tr style="background:#f8fafc;">
          <td colspan="2" style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#0369a1;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Detalhes da Viagem</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;width:50%;border-bottom:1px solid #f1f5f9;">
            <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Pacote</span>
            <br><span style="color:#0f172a;font-size:15px;font-weight:600;">${s.package_name}</span>
          </td>
          <td style="padding:12px 16px;width:50%;border-bottom:1px solid #f1f5f9;">
            <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Destino</span>
            <br><span style="color:#0f172a;font-size:15px;font-weight:600;">${s.destination||"—"}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;width:50%;border-bottom:1px solid #f1f5f9;">
            <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Data da Viagem</span>
            <br><span style="color:#0f172a;font-size:15px;font-weight:600;">${b}</span>
          </td>
          <td style="padding:12px 16px;width:50%;border-bottom:1px solid #f1f5f9;">
            <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Duração</span>
            <br><span style="color:#0f172a;font-size:15px;font-weight:600;">${s.package_duration||"—"}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;width:50%;">
            <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Passageiros</span>
            <br><span style="color:#0f172a;font-size:15px;font-weight:600;">${s.people} pessoa(s)</span>
          </td>
          <td style="padding:12px 16px;width:50%;">
            <span style="color:#94a3b8;font-size:11px;text-transform:uppercase;">Valor Total</span>
            <br><span style="color:#059669;font-size:18px;font-weight:800;">${R(Number(s.total_price))}</span>
          </td>
        </tr>
      </table>
      ${h}
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tr style="background:#f0fdf4;">
          <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
            <span style="color:#15803d;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">O que está incluso</span>
          </td>
        </tr>
        ${u}
      </table>
      ${(()=>{const o=s.occupants||[];return o.length===0?"":`<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <tr style="background:#f0f9ff;"><td colspan="4" style="padding:14px 16px;border-bottom:1px solid #e5e7eb;"><span style="color:#0369a1;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Passageiros</span></td></tr>
          <tr style="background:#f8fafc;border-bottom:1px solid #e5e7eb;">
            <td style="padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Nome</td>
            <td style="padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;">CPF</td>
            <td style="padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Nascimento</td>
            <td style="padding:6px 12px;font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:700;">Tipo</td>
          </tr>
          ${o.map((a,m)=>{const f=a.is_infant?"🍼 Colo (grátis)":"Passageiro",c=a.birth_date?new Date(a.birth_date+"T12:00:00").toLocaleDateString("pt-BR"):"—";return`<tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:8px 12px;font-size:13px;color:#0f172a;font-weight:600;">${a.name}</td>
            <td style="padding:8px 12px;font-size:13px;color:#64748b;">${a.cpf||"—"}</td>
            <td style="padding:8px 12px;font-size:13px;color:#64748b;">${c}</td>
            <td style="padding:8px 12px;font-size:12px;${a.is_infant?"color:#059669;font-weight:600;":"color:#64748b;"}">${f}</td>
          </tr>`}).join("")}
        </table>`})()}
      <div style="text-align:center;padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
        <span style="color:#15803d;font-size:14px;font-weight:700;">✅ PAGAMENTO CONFIRMADO</span>
        <br><span style="color:#4ade80;font-size:12px;">Reserva confirmada e garantida</span>
      </div>
    </div>
    <div style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="color:#64748b;font-size:12px;margin:0 0 4px;">Evastur Agência de Viagens e Turismo</p>
      <p style="color:#94a3b8;font-size:11px;margin:0;">Av. Joaquim Távora, 213 — Centro, Cruzeiro do Sul - AC</p>
      <p style="color:#94a3b8;font-size:11px;margin:4px 0 0;">evastur.com.br • @evastur.turismo</p>
    </div>
  </div>
</div>
</body>
</html>`}function te(){const[s,g]=p.useState([]),[u,b]=p.useState(!0),[d,h]=p.useState(""),[o,n]=p.useState("todos"),[a,m]=p.useState(null),[f,c]=p.useState(null),[r,x]=p.useState(null);p.useEffect(()=>{z()},[]),p.useEffect(()=>{if(r){const t=setTimeout(()=>x(null),3e3);return()=>clearTimeout(t)}},[r]);async function z(){b(!0);const{data:t,error:i}=await k.from("vouchers").select("*").order("created_at",{ascending:!1});!i&&t&&g(t),b(!1)}async function S(t){if(!t.client_email){x({message:"Cliente sem email cadastrado",type:"error"});return}c(t.id);try{const{data:{session:i}}=await k.auth.getSession();if((await fetch("https://ryzggxbhxoclojqejjne.supabase.co/functions/v1/generate-voucher",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i==null?void 0:i.access_token}`},body:JSON.stringify({resend_only:!0,voucher_id:t.id})})).ok)x({message:`Voucher reenviado para ${t.client_email}`,type:"success"});else throw new Error("Falha ao reenviar")}catch{x({message:"Erro ao reenviar voucher",type:"error"})}c(null)}function V(t){const i=j(t),l=new Blob([i],{type:"text/html"}),N=URL.createObjectURL(l),y=document.createElement("a");y.href=N,y.download=`voucher-${t.voucher_code}.html`,y.click(),URL.revokeObjectURL(N)}function L(t){const i=j(t),l=window.open("","_blank");l&&(l.document.write(i),l.document.close(),setTimeout(()=>l.print(),400))}const v=s.filter(t=>{const i=d===""||t.client_name.toLowerCase().includes(d.toLowerCase())||t.voucher_code.toLowerCase().includes(d.toLowerCase())||t.package_name.toLowerCase().includes(d.toLowerCase()),l=o==="todos"||t.status===o;return i&&l});return e.jsxs("div",{children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold text-foreground flex items-center gap-2.5",children:[e.jsx("div",{className:"w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center",children:e.jsx(_,{size:18,className:"text-cyan-500"})}),"Vouchers"]}),e.jsxs("p",{className:"text-muted-foreground text-sm mt-1",children:[s.length," voucher",s.length!==1&&"s"," gerado",s.length!==1&&"s"]})]}),e.jsxs("button",{onClick:z,className:"inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all",children:[e.jsx(U,{size:15,className:u?"animate-spin":""}),"Atualizar"]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-3 mb-6",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx(F,{size:16,className:"absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"}),e.jsx("input",{value:d,onChange:t=>h(t.target.value),placeholder:"Buscar por nome, código ou pacote...",className:"w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/50 bg-card text-foreground text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 outline-none transition-all"})]}),e.jsx("div",{className:"flex gap-2",children:["todos","ativo","cancelado"].map(t=>e.jsx("button",{onClick:()=>n(t),className:w("px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",o===t?"bg-cyan-500/10 border-cyan-500/30 text-cyan-600":"border-border/50 text-muted-foreground hover:bg-muted/50"),children:t==="todos"?"Todos":t==="ativo"?"Ativos":"Cancelados"},t))})]}),u?e.jsx("div",{className:"flex items-center justify-center py-20",children:e.jsx(C,{size:24,className:"animate-spin text-muted-foreground"})}):v.length===0?e.jsxs("div",{className:"text-center py-20",children:[e.jsx(_,{size:40,className:"mx-auto text-muted-foreground/30 mb-3"}),e.jsx("p",{className:"text-muted-foreground",children:"Nenhum voucher encontrado"})]}):e.jsx("div",{className:"space-y-3",children:v.map(t=>e.jsxs("div",{className:"bg-card border border-border/50 rounded-2xl p-5 hover:shadow-md transition-all",children:[e.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center gap-4",children:[e.jsxs("div",{className:"flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wider text-muted-foreground font-medium",children:"Código"}),e.jsx("p",{className:"font-mono font-bold text-foreground text-sm mt-0.5",children:t.voucher_code}),e.jsxs("span",{className:w("inline-flex items-center gap-1 text-xs font-medium mt-1 px-2 py-0.5 rounded-full",t.status==="ativo"?"bg-emerald-500/10 text-emerald-600":"bg-red-500/10 text-red-500"),children:[t.status==="ativo"?e.jsx($,{size:11}):e.jsx(D,{size:11}),t.status==="ativo"?"Ativo":"Cancelado"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wider text-muted-foreground font-medium",children:"Cliente"}),e.jsx("p",{className:"font-semibold text-foreground text-sm mt-0.5 truncate",children:t.client_name}),e.jsx("p",{className:"text-muted-foreground text-xs truncate",children:t.client_email||"Sem email"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wider text-muted-foreground font-medium",children:"Pacote"}),e.jsxs("p",{className:"font-semibold text-foreground text-sm mt-0.5 truncate flex items-center gap-1",children:[e.jsx(M,{size:12,className:"text-muted-foreground shrink-0"}),t.package_name]}),e.jsxs("p",{className:"text-muted-foreground text-xs flex items-center gap-1",children:[e.jsx(A,{size:11,className:"shrink-0"}),t.destination||"—"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wider text-muted-foreground font-medium",children:"Detalhes"}),e.jsxs("p",{className:"text-foreground text-sm mt-0.5 flex items-center gap-1",children:[e.jsx(E,{size:12,className:"text-muted-foreground shrink-0"}),H(t.travel_date)]}),e.jsxs("p",{className:"text-muted-foreground text-xs flex items-center gap-1",children:[e.jsx(P,{size:11,className:"shrink-0"}),t.people," pessoa(s) • ",R(Number(t.total_price))]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 lg:flex-shrink-0",children:[e.jsxs("button",{onClick:()=>m(t),className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20 transition-all",title:"Visualizar",children:[e.jsx(I,{size:14}),e.jsx("span",{className:"hidden sm:inline",children:"Ver"})]}),e.jsxs("button",{onClick:()=>S(t),disabled:f===t.id||!t.client_email,className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed",title:"Reenviar por email",children:[f===t.id?e.jsx(C,{size:14,className:"animate-spin"}):e.jsx(B,{size:14}),e.jsx("span",{className:"hidden sm:inline",children:"Reenviar"})]}),e.jsxs("button",{onClick:()=>V(t),className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all",title:"Baixar HTML",children:[e.jsx(T,{size:14}),e.jsx("span",{className:"hidden sm:inline",children:"Baixar"})]})]})]}),e.jsxs("p",{className:"text-muted-foreground/60 text-[11px] mt-3",children:["Gerado em ",G(t.created_at)]})]},t.id))}),a&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-border/30",children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"font-bold text-foreground",children:["Voucher ",a.voucher_code]}),e.jsx("p",{className:"text-muted-foreground text-sm",children:a.client_name})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("button",{onClick:()=>L(a),className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all",children:[e.jsx(T,{size:14})," Imprimir / PDF"]}),e.jsx("button",{onClick:()=>m(null),className:"w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/50 transition-colors text-muted-foreground",children:e.jsx(O,{size:18})})]})]}),e.jsx("div",{className:"flex-1 overflow-auto p-2",children:e.jsx("iframe",{srcDoc:j(a),className:"w-full h-[600px] rounded-xl border-0",title:"Preview do Voucher"})})]})}),r&&e.jsxs("div",{className:w("fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white",r.type==="success"?"bg-emerald-600":"bg-red-600"),children:[r.type==="success"?e.jsx($,{size:16}):e.jsx(D,{size:16}),r.message]})]})}export{te as default};
