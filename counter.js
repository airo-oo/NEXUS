const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            const counter = entry.target;

            const target = +counter.dataset.target;

            let current = 0;

            const speed = target / 100;

            const update = ()=>{

                current += speed;

                if(current < target){

                    counter.textContent = Math.floor(current);

                    requestAnimationFrame(update);

                }else{

                    counter.textContent = target;

                }

            }

            update();

            observer.unobserve(counter);

        }

    });

});

counters.forEach(c=>observer.observe(c));