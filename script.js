
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

// Hero design gallery: slow auto-scroll + manual drag support
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
  let autoTimer = null;
  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  function startAuto(){
    stopAuto();
    autoTimer = setInterval(() => {
      heroScroll.scrollLeft += 2.5;
      if (heroScroll.scrollLeft >= heroScroll.scrollWidth / 2) {
        heroScroll.scrollLeft = 0;
      }
    }, 16);
  }
  function stopAuto(){
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  startAuto();

  heroScroll.addEventListener('mouseenter', stopAuto);
  heroScroll.addEventListener('mouseleave', () => { if (!isDown) startAuto(); });

  heroScroll.addEventListener('mousedown', (e) => {
    isDown = true;
    heroScroll.classList.add('dragging');
    startX = e.pageX;
    startScroll = heroScroll.scrollLeft;
    stopAuto();
  });
  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    heroScroll.classList.remove('dragging');
    startAuto();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const walk = (e.pageX - startX) * 1.4;
    heroScroll.scrollLeft = startScroll - walk;
  });

  // Touch support
  heroScroll.addEventListener('touchstart', (e) => {
    stopAuto();
    startX = e.touches[0].pageX;
    startScroll = heroScroll.scrollLeft;
  }, { passive: true });
  heroScroll.addEventListener('touchmove', (e) => {
    const walk = (e.touches[0].pageX - startX) * 1.4;
    heroScroll.scrollLeft = startScroll - walk;
  }, { passive: true });
  heroScroll.addEventListener('touchend', startAuto);
}
