export async function  email  (sendMail,email,sub,text) {
    await sendMail.sendMail({
      to: email,
      subject: sub,

      html: `${text}`,
  
    }); 
  }