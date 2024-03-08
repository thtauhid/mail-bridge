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
exports.MailBridge = void 0;
const sendEmail_1 = require("./sendEmail");
class MailBridge {
    constructor(providers, secrets) {
        this.providers = providers;
        if (providers.includes("RESEND") && !(secrets === null || secrets === void 0 ? void 0 : secrets.RESEND_API_KEY)) {
            throw new Error("Error: RESEND_API_KEY is required. Pass it in the secrets object when initializing SuperSend");
        }
        this.secrets = secrets;
        console.log("SuperSend initialized");
    }
    send(email, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use the default provider if none is provided
            if (!provider) {
                return (0, sendEmail_1.sendEmail)(email, this.providers[0], this.secrets);
            }
            // Use the provided provider
            return (0, sendEmail_1.sendEmail)(email, provider, this.secrets);
        });
    }
}
exports.MailBridge = MailBridge;
