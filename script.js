
const clock=document.querySelector('#clock');
function updateClock(){
  clock.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date()).replace(':',' ').toUpperCase();
}
updateClock(); setInterval(updateClock,30000);

const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add('show')});
},{threshold:.08});
document.querySelectorAll('.section .content-shell, .section-rule').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el)});

const countObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el=entry.target, target=Number(el.dataset.count); let value=0;
    const timer=setInterval(()=>{value=Math.min(target,value+1);el.textContent=value+'+';if(value===target)clearInterval(timer)},35);
    countObserver.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>countObserver.observe(el));
