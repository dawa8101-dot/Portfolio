document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const alertBox = document.getElementById('form-alert');
  
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset alert status
      hideAlert();

      // Retrieve values and trim spacing
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const message = messageInput.value.trim();

      // 1. Validation: No field is empty
      if (!name || !email || !phone || !message) {
        showAlert('Error: All fields are required. Please fill in the entire form.', 'error');
        highlightEmptyFields([
          { el: nameInput, val: name },
          { el: emailInput, val: email },
          { el: phoneInput, val: phone },
          { el: messageInput, val: message }
        ]);
        return;
      }

      // Reset border styles after checks
      resetHighlights([nameInput, emailInput, phoneInput, messageInput]);

      // 2. Validation: Email format is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showAlert('Error: Invalid email format. Please check your email address.', 'error');
        emailInput.style.borderColor = '#ef4444';
        emailInput.focus();
        return;
      }

      // 3. Validation: Phone number contains only digits
      const digitsOnlyRegex = /^\d+$/;
      if (!digitsOnlyRegex.test(phone)) {
        showAlert('Error: Phone number must contain only digits (no spaces, dashes, or symbols).', 'error');
        phoneInput.style.borderColor = '#ef4444';
        phoneInput.focus();
        return;
      }

      // Success Path: Form is valid!
      showAlert('Success! Your message has been sent successfully. Thank you for connecting!', 'success');
      
      // Reset input fields on success
      contactForm.reset();
    });
  }

  // Display validation notification box
  function showAlert(msg, type) {
    alertBox.textContent = msg;
    alertBox.className = `form-alert ${type}`;
    // Scroll smoothly to alert box
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Hide validation notification box
  function hideAlert() {
    alertBox.textContent = '';
    alertBox.className = 'form-alert';
  }

  // Highlight empty inputs with standard error border
  function highlightEmptyFields(fields) {
    fields.forEach(field => {
      if (!field.val) {
        field.el.style.borderColor = '#ef4444';
        field.el.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      } else {
        field.el.style.borderColor = '';
        field.el.style.boxShadow = '';
      }
    });
  }

  // Reset highlight properties
  function resetHighlights(elements) {
    elements.forEach(el => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
  }
});
