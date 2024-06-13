let nodemailer = require("nodemailer");

const getHtml = (to, description, ticketNumber) => {
	return (
		`A query has been raised by user with email ${to} ` +
		"<br>" +
		"<br>" +
		"<table style='border: 1px solid white; border-collapse: collapse;'>" +
		"<thead style='border: 1px solid white;  border-collapse: collapse;'>" +
		"<th style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'> Description </th>" +
		"<th style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'> Ticket Number </th>" +
		"</thead>" +
		"<tr>" +
		"<td style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'>" +
		description +
		"</td>" +
		"<td style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'>" +
		ticketNumber +
		"</td>" +
		"</tr>" +
		"</table>"
	);
};
const getHtmlWithCamera = (to, description, ticketNumber, camera) => {
	return (
		`A query has been raised by user with email ${to} ` +
		"<br>" +
		"<br>" +
		"<table style='border: 1px solid white; border-collapse: collapse;'>" +
		"<thead style='border: 1px solid white;  border-collapse: collapse;'>" +
		"<th style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'> Description </th>" +
		"<th style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'> Ticket Number </th>" +
		"<th style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'> Camera </th>" +
		"</thead>" +
		"<tr>" +
		"<td style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'>" +
		description +
		"</td>" +
		"<td style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'>" +
		ticketNumber +
		"</td>" +
		"<td style='border: 1px solid white;  border-collapse: collapse; background-color: #96D4D4;'>" +
		JSON.stringify(
			camera?.map((item) => {
				return item.label;
			})
		) +
		"</td>" +
		"</tr>" +
		"</table>"
	);
};

const sendmailusingnodemailer = ({
	from,
	to,
	description,
	ticketNumber,
	camera,
}) => {
	const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alpha@assertai.com",
      pass: "sdukjogofhkqvwcy",
    },
  });

  const mailOptions = {
    from: "alpha@assertai.com",
    to: to,
    cc: [
      "support@assertai.com",
      "bhagyashree.joshi@assertai.com",
      "arpit.bhatiya@assertai.com",
      "dinesh.maharana@assertai.com",
      "dhanesh.mohite@assertai.com",
    ],
    subject: `Query For Alert. Ticket Number [${ticketNumber}]`,
    html: camera
      ? getHtmlWithCamera(to, description, ticketNumber, camera)
      : getHtml(to, description, ticketNumber),
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }

    transport.close();
  });
};

module.exports = { sendmailusingnodemailer };
