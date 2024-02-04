/* hamburger menu */
function onClickMenu() {
  document.getElementById("menu").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");

  document.getElementById("menu-bg").classList.toggle("change-bg");
}


/* slider */
// Glideco v1.6.0

// Config Objects
const glideConfig = {
  perView: 1,
  outerButtons: true
};
// ===============================================

// INIT/LOAD CAROUSEL TRACKS
const prepTrack = () => {
  initTrack(document.querySelector('.petco-track'), glideConfig);
  initTrack(document.querySelector('.rv-track'), glideConfig);
  initTrack(document.querySelector('.freelance-track'), glideConfig);
  initTrack(document.querySelector('.petco-hp-track'), glideConfig);
};

const initTrack = (track, config) => {
  setOuterButtons(track, config);
  handleSlide(track);
  handleBullets(track, config);
  setTileWidth(track, config);
  showHideArrows(track);
};
// ===============================================

// CAROUSEL FUNCTIONS
const handleSlide = (track) => {
  const arrows = track.querySelectorAll('.glide__arrow');
  arrows.forEach((arrow) => {
    const slides = track.querySelector('.glide__slides');
    slides.scrollTo(0, 0);

    if (arrow.getAttribute('data-event-click') !== 'true') {
      arrow.addEventListener('click', (e) => {
        if (arrow.dataset.glideDir === '<') {
          slideLeft(track);
        } else {
          slideRight(track);
        }
        showHideArrows(track);
      });
      arrow.setAttribute('data-event-click', 'true');
    }
  });
};

function slideLeft(track) {
  const slides = track.querySelector('.glide__slides');
  // Scroll certain amounts from current position

  slides.scrollBy(getTileWidth(track) * -1, 0, {
    behavior: 'smooth',
  });
}

function slideRight(track) {
  const slides = track.querySelector('.glide__slides');
  slides.scrollBy(getTileWidth(track), 0);
}

// Get the number of tiles to show based on perView breakpoint
const getBreakpointValue = (config, value) => {
  if (config.breakpoints) {
    const viewportWidth = window.innerWidth;
    const breakPointArr = [];
    let res = config[value];
    for (const breakpoint in config.breakpoints) {
      breakPointArr.push(parseInt(breakpoint));
    }

    breakPointArr.reverse().forEach((breakpoint) => {
      if (viewportWidth < breakpoint) {
        res = config.breakpoints[breakpoint][value];
      }
    });

    return res;
  }
};

// Set padding on track for OuterButtons
const setOuterButtons = (track, config, arrows) => {
  const paddingObj = getTrackPadding(track, config);
  track.style.padding = `${paddingObj.paddingTopBottom}px ${paddingObj.paddingSides}px`;
};

const getTrackPadding = (track, config, arrows) => {
  const trackPadding = {
    paddingTopBottom: 0,
    paddingSides: 0,
  };
  if (getBreakpointValue(config, 'outerButtons')) {
    trackPadding.paddingTopBottom = 0;
    trackPadding.paddingSides = 0;
  } else {
    trackPadding.paddingTopBottom = 25;
    trackPadding.paddingSides = 4;
  }
  return trackPadding;
};

const getTileWidth = (track) => {
  return parseFloat(
    track.querySelector('.glide__slide').getBoundingClientRect().width
  );
};

// Sets each tiles width based on how many tiles are shown and the track width.
const setTileWidth = (track, config) => {
  const perView = getBreakpointValue(config, 'perView');
  const peek = getBreakpointValue(config, 'peek') || 0;
  const trackPaddingSides = getTrackPadding(track, config).paddingSides * 2;
  const trackWidth = track.getBoundingClientRect().width - trackPaddingSides;
  const glideSlides = track.querySelectorAll('.glide__slide');

  glideSlides.forEach((slide) => {
    const slideMargin = window.getComputedStyle(slide);
    const margin = 20;
    slide.style.width = `${trackWidth / perView - margin - peek}px`;
    getSlideObserver(track).observe(slide);
  });
};

// Keep track of which slides are in visable in the track
const isObservableArray = [];
const getSlideObserver = (track) => {
  let observerOptions = {
    root: track.querySelector('.glide__slides'),
    rootMargin: '0px',
    threshold: 0.5,
  };

  let slideObserver = new IntersectionObserver((entries, slideObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isObservableArray.push(entry.target.dataset.pos);
      } else if (isObservableArray.indexOf(entry.target.dataset.pos) !== -1) {
        let elemIndex = isObservableArray.indexOf(entry.target.dataset.pos);
        isObservableArray.splice(elemIndex, 1);
      }

      isObservableArray.sort();
      activateBullets(isObservableArray);
    });
  }, observerOptions);
  return slideObserver;
};

function showHideArrows(track) {
  let firstSlide = track.firstElementChild.firstElementChild;
  let lastSlide = track.firstElementChild.lastElementChild;
  const leftArrow = track.querySelector('[data-glide-dir="<"]');
  const rightArrow = track.querySelector(`[data-glide-dir=">"]`);

  const firstSlideObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        leftArrow.style.opacity = 0.2;
      } else {
        leftArrow.style.opacity = 1;
      }
    });
  });

  const lastSlideObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        rightArrow.style.opacity = 0.2;
      } else {
        rightArrow.style.opacity = 1;
      }
    });
  });

  firstSlideObserver.observe(firstSlide);
  lastSlideObserver.observe(lastSlide);
}

const handleBullets = (track, config) => {
  const bullets = track.querySelectorAll('.glide__bullet') || null;
  const slides = track.querySelectorAll('.glide__slide');

  if (bullets.length > 0) {
    bullets.forEach((bullet) =>
      bullet.addEventListener('click', (ev) => {
        slides[ev.target.dataset.bulletTarget].scrollIntoView({
          alignToTop: false,
          block: 'nearest',
          inline: 'start',
        });
      })
    );
  }
};

const activateBullets = (activeBulletsArray) => {
  if (activeBulletsArray.length <= 0) {
    return;
  }
  const bullets = document.querySelectorAll('.glide__bullet') || undefined;
  bullets.forEach((bullet) => bullet.classList.remove('active'));
  activeBulletsArray.map((bulletPos) => {
    document
      .querySelector(`[data-bullet-target="${bulletPos}"]`)
      .classList.add('active');
  });
};

window.addEventListener('load', () => {
  prepTrack();
});

window.addEventListener('resize', () => {
  prepTrack();
});

// tab menu
$('.tab-menu li a').on('click', function(){
  var target = $(this).attr('data-rel');
$('.tab-menu li a').removeClass('active');
  $(this).addClass('active');
  $("#"+target).fadeIn('slow').siblings(".tab-box").hide();
  return false;
});
