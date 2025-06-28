function message(template, params = {}) {
    let msg = template;

    for (const [key, value] of Object.entries(params)) {
        msg = msg.replace(new RegExp(`{{${key}}}`, "g"), value);
    }

    return msg;
}

module.exports = message;
