import emailjs from 'emailjs-com';

emailjs.init('Hwy3DTSecMURqGo0X');

export const sendEmail = (textarea, subject, name, email) => {
    const templateParams = {
      name: name,
      email: email,
      subject: subject,
      textarea: textarea
    };
  
    emailjs
      .send('service_7kzxz87', 'template_jt4nl7j', templateParams)
      .then(
        function (response) {
          // Now, you can also call your approveStudent function
        },
        function (error) {
          console.error('Approval email delivery failed', error);
        }
      );
  };

  export const emailDecision = (student, decision) => {
    const templateParams = {
      to_name: student.displayName,
      to_email: student.email,
      team_decision: decision
    };
  
    emailjs
      .send('service_7kzxz87', 'template_qy0n03u', templateParams)
      .then(
        function (response) {
        },
        function (error) {
          console.error('Approval email delivery failed', error);
        }
      );
  };
  