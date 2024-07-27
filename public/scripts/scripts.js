document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#form-delete').forEach(function(form) {
      form.addEventListener('submit', function(event) {
        var confirmed = confirm('Are you sure you want to delete this post?');
        if (!confirmed) {
          event.preventDefault();
        }
      });
    });
  });