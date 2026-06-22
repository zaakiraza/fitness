/**
 * FitTrack Pro – Main JavaScript
 * Handles: Navigation, Workouts, BMI, Water, Calories, Contact
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initHeroCarousel();
  initCarousels();
  initScrollReveal();
  initCounters();
  initWorkoutTracker();
  initBMICalculator();
  initWaterTracker();
  initCalorieTracker();
  initContactForm();
});

/* ============================================
   Navigation (Mobile Menu)
   ============================================ */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================
   Header Scroll Effect
   ============================================ */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================
   Hero Background Carousel
   ============================================ */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');

  if (slides.length === 0) return;

  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() {
    interval = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(interval);
    startAuto();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.slide));
      resetAuto();
    });
  });

  startAuto();
}

/* ============================================
   Content Carousels
   ============================================ */
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.parentElement.querySelector('.carousel-prev');
    const nextBtn = carousel.parentElement.querySelector('.carousel-next');
    const indicators = carousel.parentElement.querySelectorAll('.carousel-indicator');

    if (!track || slides.length === 0) return;

    let current = 0;
    let interval;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      indicators.forEach((ind, i) => ind.classList.toggle('active', i === current));
    }

    function startAuto() {
      interval = setInterval(() => goTo(current + 1), 6000);
    }

    function resetAuto() {
      clearInterval(interval);
      startAuto();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    }

    indicators.forEach(ind => {
      ind.addEventListener('click', () => {
        goTo(Number(ind.dataset.index));
        resetAuto();
      });
    });

    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    }, { passive: true });

    startAuto();
  });
}

/* ============================================
   Scroll Reveal Animations
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      el.classList.add('visible');
    } else {
      observer.observe(el);
    }
  });
}

/* ============================================
   Animated Counters
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length === 0) return;

  const animateCounter = el => {
    const target = Number(el.dataset.count);
    const format = el.dataset.format;
    const duration = 2000;
    const start = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);

      if (format === 'k') {
        el.textContent = progress >= 1 ? `${target}K` : value;
      } else if (target >= 1000) {
        el.textContent = value.toLocaleString();
      } else {
        el.textContent = value;
      }

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================
   Workout Tracker – Local Storage
   ============================================ */
const WORKOUT_KEY = 'fittrack_workouts';

function initWorkoutTracker() {
  const form = document.getElementById('workout-form');
  const list = document.getElementById('workout-list');

  if (!form || !list) return;

  renderWorkouts();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const exercise = document.getElementById('exercise').value.trim();
    const duration = document.getElementById('duration').value.trim();

    if (!exercise || !duration) return;

    const workouts = getWorkouts();
    workouts.push({ id: Date.now(), exercise, duration });
    saveWorkouts(workouts);

    form.reset();
    renderWorkouts();
  });

  list.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-workout')) {
      const id = Number(e.target.dataset.id);
      const workouts = getWorkouts().filter(w => w.id !== id);
      saveWorkouts(workouts);
      renderWorkouts();
    }
  });
}

function getWorkouts() {
  const data = localStorage.getItem(WORKOUT_KEY);
  return data ? JSON.parse(data) : [];
}

function saveWorkouts(workouts) {
  localStorage.setItem(WORKOUT_KEY, JSON.stringify(workouts));
}

function renderWorkouts() {
  const list = document.getElementById('workout-list');
  const countEl = document.getElementById('workout-count');
  const workouts = getWorkouts();

  if (workouts.length === 0) {
    list.innerHTML = '<tr class="empty-row"><td colspan="3">No workouts added yet. Start tracking!</td></tr>';
  } else {
    list.innerHTML = workouts.map(w => `
      <tr>
        <td>${escapeHTML(w.exercise)}</td>
        <td>${escapeHTML(w.duration)}</td>
        <td>
          <button class="btn btn-danger delete-workout" data-id="${w.id}" aria-label="Delete ${escapeHTML(w.exercise)}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  if (countEl) {
    countEl.textContent = `Total: ${workouts.length} workout${workouts.length !== 1 ? 's' : ''}`;
  }
}

/* ============================================
   BMI Calculator
   ============================================ */
function initBMICalculator() {
  const form = document.getElementById('bmi-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (!weight || !height || weight <= 0 || height <= 0) return;

    const bmi = weight / ((height / 100) ** 2);
    const rounded = Math.round(bmi * 10) / 10;

    const category = getBMICategory(bmi);
    const resultEl = document.getElementById('bmi-result');
    const numberEl = document.getElementById('bmi-number');
    const categoryEl = document.getElementById('bmi-category');
    const scaleBar = document.getElementById('bmi-scale-bar');

    numberEl.textContent = rounded;
    categoryEl.textContent = category.label;
    categoryEl.style.color = category.color;
    resultEl.hidden = false;

    if (scaleBar) {
      const position = Math.min(Math.max((bmi / 40) * 100, 2), 98);
      scaleBar.style.left = `${position}%`;
    }
  });
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
  if (bmi < 25) return { label: 'Healthy Weight', color: '#22c55e' };
  if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
  return { label: 'Obese', color: '#e50914' };
}

/* ============================================
   Water Intake Tracker – Local Storage
   ============================================ */
const WATER_KEY = 'fittrack_water';
const WATER_DATE_KEY = 'fittrack_water_date';
const WATER_GOAL = 8;

function initWaterTracker() {
  const addBtn = document.getElementById('add-glass');
  const resetBtn = document.getElementById('reset-water');

  if (!addBtn) return;

  checkWaterDate();
  updateWaterDisplay();

  addBtn.addEventListener('click', () => {
    let count = getWaterCount();
    count++;
    saveWaterCount(count);
    updateWaterDisplay();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      saveWaterCount(0);
      updateWaterDisplay();
    });
  }
}

function checkWaterDate() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(WATER_DATE_KEY);

  if (savedDate !== today) {
    localStorage.setItem(WATER_DATE_KEY, today);
    saveWaterCount(0);
  }
}

function getWaterCount() {
  return parseInt(localStorage.getItem(WATER_KEY), 10) || 0;
}

function saveWaterCount(count) {
  localStorage.setItem(WATER_KEY, count);
  localStorage.setItem(WATER_DATE_KEY, new Date().toDateString());
}

function updateWaterDisplay() {
  const countEl = document.getElementById('water-count');
  const progressBar = document.getElementById('water-progress-bar');

  if (!countEl) return;

  const count = getWaterCount();
  countEl.textContent = count;

  if (progressBar) {
    const percent = Math.min((count / WATER_GOAL) * 100, 100);
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', count);
  }
}

/* ============================================
   Daily Calorie Goal Tracker (Unique Feature)
   ============================================ */
const CALORIE_GOAL_KEY = 'fittrack_calorie_goal';
const CALORIE_MEALS_KEY = 'fittrack_calorie_meals';
const CALORIE_DATE_KEY = 'fittrack_calorie_date';

function initCalorieTracker() {
  const goalForm = document.getElementById('calorie-goal-form');
  const foodForm = document.getElementById('food-form');
  const resetBtn = document.getElementById('reset-calories');

  if (!goalForm) return;

  checkCalorieDate();
  updateCalorieDisplay();

  goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = parseInt(document.getElementById('calorie-goal').value, 10);
    if (goal && goal > 0) {
      localStorage.setItem(CALORIE_GOAL_KEY, goal);
      updateCalorieDisplay();
    }
  });

  if (foodForm) {
    foodForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('meal-name').value.trim();
      const calories = parseInt(document.getElementById('meal-calories').value, 10);

      if (!name || !calories || calories <= 0) return;

      const meals = getMeals();
      meals.push({ id: Date.now(), name, calories });
      saveMeals(meals);

      foodForm.reset();
      updateCalorieDisplay();
    });
  }

  const mealList = document.getElementById('meal-list');
  if (mealList) {
    mealList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-meal')) {
        const id = Number(e.target.dataset.id);
        const meals = getMeals().filter(m => m.id !== id);
        saveMeals(meals);
        updateCalorieDisplay();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      saveMeals([]);
      updateCalorieDisplay();
    });
  }
}

function checkCalorieDate() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(CALORIE_DATE_KEY);

  if (savedDate !== today) {
    localStorage.setItem(CALORIE_DATE_KEY, today);
    saveMeals([]);
  }
}

function getCalorieGoal() {
  return parseInt(localStorage.getItem(CALORIE_GOAL_KEY), 10) || 2000;
}

function getMeals() {
  const data = localStorage.getItem(CALORIE_MEALS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveMeals(meals) {
  localStorage.setItem(CALORIE_MEALS_KEY, JSON.stringify(meals));
  localStorage.setItem(CALORIE_DATE_KEY, new Date().toDateString());
}

function getTotalConsumed() {
  return getMeals().reduce((sum, meal) => sum + meal.calories, 0);
}

function updateCalorieDisplay() {
  const goal = getCalorieGoal();
  const consumed = getTotalConsumed();
  const remaining = Math.max(goal - consumed, 0);

  const goalEl = document.getElementById('display-goal');
  const consumedEl = document.getElementById('display-consumed');
  const remainingEl = document.getElementById('display-remaining');
  const progressBar = document.getElementById('calorie-progress-bar');
  const mealList = document.getElementById('meal-list');
  const goalInput = document.getElementById('calorie-goal');

  if (goalEl) goalEl.textContent = goal;
  if (consumedEl) consumedEl.textContent = consumed;
  if (remainingEl) {
    remainingEl.textContent = remaining;
    remainingEl.style.color = consumed > goal ? '#e50914' : '';
  }
  if (goalInput) goalInput.value = goal;

  if (progressBar) {
    const percent = Math.min((consumed / goal) * 100, 100);
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(percent));
  }

  if (mealList) {
    const meals = getMeals();
    if (meals.length === 0) {
      mealList.innerHTML = '<li class="empty-meal">No meals added yet.</li>';
    } else {
      mealList.innerHTML = meals.map(m => `
        <li>
          <span>${escapeHTML(m.name)}</span>
          <span>
            <span class="meal-cal">${m.calories} kcal</span>
            <button class="btn btn-danger delete-meal" data-id="${m.id}" aria-label="Delete ${escapeHTML(m.name)}" style="margin-left:0.5rem;">×</button>
          </span>
        </li>
      `).join('');
    }
  }
}

/* ============================================
   Contact Form
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    const successEl = document.getElementById('contact-success');
    form.reset();

    if (successEl) {
      successEl.hidden = false;
      setTimeout(() => {
        successEl.hidden = true;
      }, 5000);
    }
  });
}

/* ============================================
   Utility
   ============================================ */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
