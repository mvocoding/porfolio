document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);
    const $$ = (selector) => document.querySelectorAll(selector);
    const CORSPROXY = 'https://proxy.corsfix.com/?';
    const MAX_ITEMS = 12;
  
    const resumeModal = $('resumeModal');
    const btnOpenModal = $('btnOpenModal');
    const btnCloseModal = $('btnCloseModal');
    const loader = $('loader');
    const projectWrapper = $('project-wrapper');
    const template = $('projectItemTpl');
    const wrapperTemplate = document.querySelector('#tplliveproject');
    
    const DATA = {
        email: 'maxvo.dev@gmail.com',
        linkedin: 'https://www.linkedin.com/in/max-vo/',
        github: 'https://github.com/mvocoding',
        aboutme: `A full stack website developer focusing on creating fancy and elegant websites for all users and customers. I’m an active learner who enjoys exploring new technologies and continuously improving my skills. I believe every project is a new mountain to climb, and I’m always ready for the next challenge on my programming journey` ,
        projects: [
            {
                id: 'codemax',
                type: 'video',
                src: 'assets/codemax.mp4',
                logo: 'assets/codemax-h.png',
                title: 'Coding Made Easy',
                desc: `Codemax is a platform I designed to support developers through interactive learning, hands-on challenges, and a focus on real-world skills—making growth accessible and engaging`,
                btnText: 'Explore Codemax',
                btnLink: 'https://codemax.dev/'
            },            
            {
                id: 'starfish',
                type: 'image',
                src: 'assets/starfish-project.png',
                logo: 'assets/starfish-h.png',
                title: 'Transforming Public Safety Reporting',
                desc: `At Starfish, I designed and delivered a mobile-friendly, multi-tenant crime reporting platform supporting anonymous submissions, media uploads, and audit logging—enhancing transparency, accessibility, and performance`,
            },
            {
                id: 'codinggpt',
                type: 'video',
                src: 'assets/codinggpt.mp4',
                logo: 'assets/codinggpt-h.png',
                title: 'Bringing Code to Life',
                desc: `CodingGPT is my Tiktok channel where I share short-form videos on CSS animations, front-end effects, and web UI experiments—making web design fun, visual, and inspiring`,
                btnText: 'Watch on TikTok',
                btnLink: 'https://www.tiktok.com/@codinggpt' 
            },            
            {
                id: 'dxc',
                type: 'image',
                src: 'assets/dxc-nursing.png',
                logo: 'assets/dxc-h.png',
                title: 'Modernizing Resident Care Systems',
                desc: `At DXC Technology, I contributed to the design of a digital care platform for nursing homes, supporting real-time health monitoring, simplified medication management, and smoother collaboration between nurses and doctors`
            }
        ]
    };
  
    const bindStaticText = () => {
      $$('[data-bind]').forEach((el) => {
        const key = el.dataset.bind;
        el.textContent = DATA[key] || '';
      });
    };
  
    const createProjectElement = (project, index) => {
      const clone = template.content.cloneNode(true);
      const rootEl = clone.firstElementChild;
      rootEl.id = project.id;
  
      if (index === 0) rootEl.classList.add('bg-highlight');
  
      clone.querySelector('[data-title]').textContent = project.title;
      clone.querySelector('[data-desc]').textContent = project.desc;
  
      const btn = clone.querySelector('[data-btn]');
      if (project.btnText && project.btnLink) {
        btn.textContent = project.btnText;
        btn.addEventListener('click', () => window.open(project.btnLink, '_blank'));
      } else {
        btn.classList.add('!hidden');
      }
  
      const mediaContainer = clone.querySelector('.media');
      if (project.type === 'video') {
        const video = document.createElement('video');
        Object.assign(video, { src: project.src, autoplay: true, loop: true, muted: true, playsInline: true });
        mediaContainer.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = project.src;
        mediaContainer.appendChild(img);
      }
  
      return rootEl;
    };
  
    const renderLiveProjects = async () => {
      const container = document.querySelector('.liveproject');
      const wrapper = wrapperTemplate.content.querySelector('.liveproject-wrapper').cloneNode(true);
      const itemTemplate = wrapperTemplate.content.querySelector('.liveproject-item');
  
      try {
        const username = 'maxvo_dev';
        const input = { '0': { json: { username } } };
        let encodedInput = encodeURIComponent(JSON.stringify(input));
        let url = `${CORSPROXY}https://icodethis.com/api/trpc/user.getUserSubmissions,user.getUserBadges?batch=1&input=${encodedInput}`;
  
        const fetchSubmission = await fetch(url);
        const data = await fetchSubmission.json();
        const projects = data?.[0]?.result?.data?.json?.modes_submission?.slice(0, MAX_ITEMS) || [];
  
        await Promise.all(projects.map(async (project) => {
          const { href, id, title, img_url, mode: { id: projectID } } = project;
          const item = itemTemplate.cloneNode(true);
          const titleEl = item.querySelector('.title');
          const imgEl = item.querySelector('.image');
          const btn = item.querySelector('.view-btn');
  
          const input = { '0': { json: { id: projectID } } };
          encodedInput = encodeURIComponent(JSON.stringify(input));
          url = `${CORSPROXY}https://icodethis.com/api/trpc/designToCode.getChallenge,designToCode.getSubmissionByChallengeId?batch=1&input=${encodedInput}`;
  
          const fetchChallenge = await fetch(url);
          const challengeData = await fetchChallenge.json();
          const challengeImg = challengeData[0].result.data.json.meta.image;
          const defaultImg = `https://icodethis.com/images/projects/${challengeImg}`;
          const imgSrc = img_url ? `https://shismqklzntzxworibfn.supabase.co/storage/v1/object/public/previews/${img_url}` : defaultImg;
  
          titleEl.textContent = title;
          imgEl.src = imgSrc;
          btn.addEventListener('click', () => window.open(`https://icodethis.com${href}`, '_blank'));
  
          wrapper.appendChild(item);
        }));
  
        container.appendChild(wrapper);
      } catch (error) {
        console.error('Failed to fetch live projects:', error);
      }
    };
  
    const renderPortfolioProjects = () => {
      DATA.projects.forEach((project, index) => {
        const projectElement = createProjectElement(project, index);
        projectWrapper.appendChild(projectElement);
      });
    };
  
    const hideLoaderAfterDelay = () => setTimeout(() => loader?.classList.add('hidden'), 3000);
  
    const initialize = () => {
      bindStaticText();
      renderLiveProjects();
      renderPortfolioProjects();
      hideLoaderAfterDelay();
    };
  
    btnOpenModal.addEventListener('click', () => resumeModal.classList.add('active'));
    btnCloseModal.addEventListener('click', () => resumeModal.classList.remove('active'));
  
    initialize();
  });
  