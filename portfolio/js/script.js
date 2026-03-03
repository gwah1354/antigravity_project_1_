/*
  ============================================================
  STEP 3 — UNDERSTANDING JAVASCRIPT
  ============================================================

  JavaScript (JS) makes your website INTERACTIVE.
  HTML = Structure (the skeleton)
  CSS  = Appearance (the clothes)
  JS   = Behavior (the brain — reacts to user actions)

  HOW JS WORKS IN THE BROWSER:
  The browser gives JS access to the DOM (Document Object Model).
  The DOM is a tree of all your HTML elements.
  With JS, you can READ, MODIFY, ADD, or REMOVE any HTML element!

  Key concept: EVENTS
  A user clicking a button, scrolling, or typing are all "events".
  We use event "listeners" to watch for these and run our code.
  ============================================================
*/


/* ============================================================
   PART 1: Wait for the page to fully load before running JS.
   ============================================================
   DOMContentLoaded fires when the browser has finished reading
   all HTML. We wrap ALL our code inside this so we know the
   HTML elements we need are actually loaded and available.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /*
    ============================================================
    UTILITY: initAll()
    ============================================================
    We organize all our features into separate functions,
    then call them all from one place. This is cleaner than
    writing all code in one giant block.
    ============================================================
  */
  initNavbar();
  initMobileMenu();
  initSmoothScrolling();
  initScrollSpy();
  initSkillBars();
  initScrollAnimations();
  initContactForm();
  initFooterYear();


  /* ============================================================
     FEATURE 1: NAVBAR — Scroll Effect
     ============================================================
     When the user scrolls DOWN more than 20px, we add a
     .scrolled CSS class to the navbar. When they scroll back
     up to the top, we remove it.

     This changes the navbar background from glass-transparent
     to a solid dark — useful for readability as you scroll.
     ============================================================ */
  function initNavbar() {
    // document.querySelector() finds the FIRST element matching a CSS selector
    const navbar = document.querySelector('#navbar');

    // If the element doesn't exist, stop the function (safety check)
    if (!navbar) return;

    // We listen for the "scroll" event on the window (the browser viewport)
    window.addEventListener('scroll', function () {
      // window.scrollY is how many pixels the user has scrolled down
      if (window.scrollY > 20) {
        // classList.add() adds a CSS class to an element
        navbar.classList.add('scrolled');
      } else {
        // classList.remove() removes a CSS class
        navbar.classList.remove('scrolled');
      }
    });
  }


  /* ============================================================
     FEATURE 2: MOBILE MENU — Hamburger Toggle
     ============================================================
     On small screens, the nav links are HIDDEN by default.
     When the hamburger button is clicked, we toggle a .open
     class that slides the menu into view (CSS handles the animation).
     ============================================================ */
  function initMobileMenu() {
    const hamburger = document.querySelector('#hamburger');
    const navLinks = document.querySelector('#nav-links');

    if (!hamburger || !navLinks) return;

    // Each time the hamburger is clicked, this function runs
    hamburger.addEventListener('click', function () {
      // classList.toggle() ADDS the class if it's absent, REMOVES if present
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');

      // Update aria-expanded for accessibility.
      // (aria attributes help screen readers understand the UI state)
      const isOpen = hamburger.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close the mobile menu when any nav link is clicked
    // querySelectorAll() returns ALL matching elements as a list (NodeList)
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      // forEach loops over each item in the list
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }


  /* ============================================================
     FEATURE 3: SMOOTH SCROLLING (Enhanced)
     ============================================================
     CSS handles smooth scrolling for #anchor links.
     But we add JS for extra control — like accounting for the
     fixed navbar height so sections aren't hidden under it.
     ============================================================ */
  function initSmoothScrolling() {
    // Select all anchor links (links that start with #)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (event) {
        // The href attribute value, e.g. "#about"
        const href = link.getAttribute('href');

        // Skip empty anchors
        if (href === '#') return;

        // Find the target element on the page
        const target = document.querySelector(href);
        if (!target) return;

        // Prevent the default browser jump behavior
        event.preventDefault();

        // Get the navbar height to offset the scroll position
        const navbarHeight = document.querySelector('#navbar')?.offsetHeight || 70;

        // Calculate the exact pixel position to scroll to
        // getBoundingClientRect() returns the size and position of an element
        const targetPosition = target.getBoundingClientRect().top
          + window.scrollY   // current scroll position
          - navbarHeight     // minus navbar height
          - 20;              // a little extra breathing room

        // Scroll to the calculated position with smooth animation
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }


  /* ============================================================
     FEATURE 4: SCROLL SPY — Highlight Active Nav Link
     ============================================================
     As the user scrolls, we detect which section is currently
     visible and add .active to the matching nav link.

     IntersectionObserver is a modern browser API that tells us
     when an element enters or exits the viewport (visible area).
     It's more efficient than calculating scroll positions manually.
     ============================================================ */
  function initScrollSpy() {
    // Select all page sections with an id
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    // Create an IntersectionObserver
    const observer = new IntersectionObserver(
      function (entries) {
        // entries is an array — one entry per observed element
        entries.forEach(function (entry) {
          // entry.isIntersecting means the element is visible in the viewport
          if (entry.isIntersecting) {
            // The id of the visible section, e.g. "about"
            const id = entry.target.id;

            // Remove .active from ALL nav links first
            navLinks.forEach(link => link.classList.remove('active'));

            // Add .active only to the nav link that points to this section
            // [href="#about"] is an attribute selector in CSS
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) {
              activeLink.classList.add('active');
            }
          }
        });
      },
      {
        // rootMargin shifts the "trigger zone". This means the observer
        // fires when the element is at least 30% inside the viewport from the top.
        rootMargin: '-30% 0px -60% 0px'
      }
    );

    // Tell the observer to watch each section
    sections.forEach(section => observer.observe(section));
  }


  /* ============================================================
     FEATURE 5: ANIMATED SKILL BARS
     ============================================================
     The skill bars start at width: 0 (in CSS).
     When the About section becomes visible, we read each bar's
     data-level attribute and animate it to that percentage.
     ============================================================ */
  function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    if (!skillFills.length) return;

    // Watch for the About section to enter the viewport
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) return;

    let animated = false; // Track if we've already animated

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Only animate once (when first becoming visible)
          if (entry.isIntersecting && !animated) {
            animated = true;

            skillFills.forEach(function (fill) {
              // Read the data-level attribute from HTML (e.g. "80")
              const level = fill.getAttribute('data-level');

              // A small delay before starting the animation for a nice effect
              setTimeout(function () {
                // Set the width — this triggers the CSS transition animation!
                fill.style.width = level + '%';
              }, 200);
            });
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    observer.observe(aboutSection);
  }


  /* ============================================================
     FEATURE 6: SCROLL-IN ANIMATIONS
     ============================================================
     Elements start invisible (in CSS: opacity 0, translated down).
     When they enter the viewport, we add .visible which
     transitions them to visible (opacity 1, translate 0).
     ============================================================ */
  function initScrollAnimations() {
    // Select the elements we want to animate in
    const targets = document.querySelectorAll(
      '.project-card, .about-content, .contact-wrapper, .section-header'
    );
    if (!targets.length) return;

    targets.forEach(function (el) {
      // Initially hide elements (we use a CSS class for this)
      el.classList.add('fade-in-ready');
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            // Once animated, stop observing it (performance optimization)
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    targets.forEach(el => observer.observe(el));

    // Add the CSS for these classes dynamically
    // (we inject a <style> block so we don't need extra CSS)
    const style = document.createElement('style');
    style.textContent = `
      .fade-in-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }


  /* ============================================================
     FEATURE 7: CONTACT FORM VALIDATION & SUBMISSION
     ============================================================
     We validate that all fields are filled in before submitting.
     Since we have no backend server, we SIMULATE a submission
     and show a success message. You can later connect this to
     a real email service like Formspree (formspree.io).
     ============================================================ */
  function initContactForm() {
    const form = document.querySelector('#contact-form');
    const feedback = document.querySelector('#form-feedback');
    if (!form) return;

    // =========================================================
    // SUPABASE INITIALIZATION
    // =========================================================
    // These credentials allow your website to connect to your
    // Supabase project and insert data into the "messages" table.
    const SUPABASE_URL = "https://rjyutkewkohrttxklwil.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeXV0a2V3a29ocnR0eGtsd2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDcyODYsImV4cCI6MjA4ODEyMzI4Nn0.cYeKYo2n1JqNw6h9cV6oVt5hHE1QSY1qd3xjHEJBqYI";

    // Create the Supabase client (only done once)
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');

    // "submit" event fires when the user clicks the submit button
    // Using async function so we can use await for database operations
    form.addEventListener('submit', async function (event) {
      // Prevent the default behavior (which would reload the page)
      event.preventDefault();

      // Clear previous error messages
      clearErrors();

      // Get references to the input elements
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const messageInput = document.querySelector('#message');

      // --- Validate each field ---
      let hasErrors = false;

      // Check: name not empty
      if (!nameInput.value.trim()) {
        showError('name-error', 'Please enter your name.');
        hasErrors = true;
      }

      // Check: email not empty AND has valid format
      if (!emailInput.value.trim()) {
        showError('email-error', 'Please enter your email.');
        hasErrors = true;
      } else if (!isValidEmail(emailInput.value)) {
        showError('email-error', 'Please enter a valid email address.');
        hasErrors = true;
      }

      // Check: message not empty
      if (!messageInput.value.trim()) {
        showError('message-error', 'Please enter a message.');
        hasErrors = true;
      }

      // If there are errors, stop here (validation preserved ✓)
      if (hasErrors) return;

      // --- REAL SUPABASE SUBMISSION ---
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        // Insert data into Supabase "messages" table
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              name: nameInput.value.trim(),
              email: emailInput.value.trim(),
              message: messageInput.value.trim()
              // created_at is handled automatically by Supabase default
            }
          ]);

        // Check if Supabase returned an error
        if (error) {
          throw error;
        }

        // SUCCESS: Message was saved to database
        form.reset();

        if (feedback) {
          feedback.className = 'form-feedback success';
          feedback.textContent = '✅ Message sent! I\'ll get back to you soon.';
        }

        // Re-enable button and clear feedback after 4 seconds
        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message 🚀';
          if (feedback) {
            feedback.className = 'form-feedback';
            feedback.textContent = '';
          }
        }, 4000);

      } catch (error) {
        // ERROR: Something went wrong (network issue, database error, etc.)
        console.error('❌ Error submitting form:', error);
        console.error('Error details:', error.message || error);

        // Show error message to user
        if (feedback) {
          feedback.className = 'form-feedback error';
          feedback.textContent = '❌ Failed to send message. Please try again.';
        }

        // Re-enable the submit button so user can retry
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message 🚀';
      }
    });

    // --- Helper Functions ---

    // Shows an error message under a specific field
    function showError(elementId, message) {
      const errorEl = document.querySelector('#' + elementId);
      if (errorEl) errorEl.textContent = message;
    }

    // Clears all error messages
    function clearErrors() {
      const errors = document.querySelectorAll('.form-error');
      errors.forEach(function (el) { el.textContent = ''; });
      if (feedback) {
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }
    }

    // Tests if an email string has a valid format using a Regular Expression
    // A Regular Expression (regex) is a pattern for matching text.
    // This one checks: [something]@[something].[something]
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }


  /* ============================================================
     FEATURE 8: AUTO-UPDATE FOOTER YEAR
     ============================================================
     Instead of hardcoding "2024" in the footer, we get the
     current year dynamically. This way it's always correct!
     ============================================================ */
  function initFooterYear() {
    const yearEl = document.querySelector('#year');
    if (yearEl) {
      // new Date() creates a Date object representing right now
      // .getFullYear() extracts just the 4-digit year
      yearEl.textContent = new Date().getFullYear();
    }
  }

}); // End of DOMContentLoaded
