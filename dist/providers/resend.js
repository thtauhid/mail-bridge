"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail_RESEND = void 0;
const resend_1 = require("resend");
const sendEmail_RESEND = (email, api_key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resend = new resend_1.Resend(api_key);
        const data = yield resend.emails.send({
            from: email.from,
            to: email.to,
            subject: email.subject,
            html: email.body,
        });
        console.log(data);
        return data;
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendEmail_RESEND = sendEmail_RESEND;
