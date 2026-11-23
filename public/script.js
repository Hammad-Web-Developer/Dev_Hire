const recruitSignupForm = document.getElementById("recruit-signup-form")
const recruitSendCodeButton = recruitSignupForm?.querySelector(".button-secondary")
const recruitLoginForm = document.getElementById("recruit-login-form")
const companySignupForm = document.getElementById("company-signup-form")
const companySendCodeButton = companySignupForm?.querySelector(".button-secondary")
const companyLoginForm = document.getElementById("company-login-form")
const forgotPasswordForm = document.getElementById("forgot-password-form")
const forgotPasswordSendCodeButton = forgotPasswordForm?.querySelector(".button-secondary")
const companyCheckbox = document.getElementById("company")

const primaryUrl = "http://localhost:6060"

const makeFetchCall = async (path, method, headers, body) => {
    try {
        const response = await fetch(`${primaryUrl}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });

        const contentType = response.headers.get("content-type");

        let result;

        if (contentType?.includes("application/json")) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        if (!response.ok) {
            const message = typeof result === "string"
                ? result
                : result.message || result.error || "Something went wrong!";

            throw new Error(message);
        }

        return {
            success: true,
            message: result
        };

    } catch (err) {
        showToast(err.message);
        return {
            success: false,
            message: err.message
        };
    }
};


recruitSendCodeButton?.addEventListener("click",async()=>{
    const recruitEmail = recruitSignupForm?.querySelector("#email")
    const headers = {
        "Content-Type" : "application/json"
    }
    const body = {
        email : recruitEmail.value,
        purpose : "user-sign-up"
    }
    const result = await makeFetchCall("/recruit/verify-email","POST",headers,body)
    showToast(result.message)
})

recruitSignupForm?.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const formObject = new FormData(recruitSignupForm)
    const formData = Object.fromEntries(formObject.entries())
    formData.purpose = "user-sign-up"
    const headers = {
        "Content-Type" : "application/json"
    }
    const status = await makeFetchCall("/recruit/signup","POST",headers,formData)
    if (status.success)
        window.location.href = "login-individual.html"
})

recruitLoginForm?.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const formObject = new FormData(recruitLoginForm)
    const formData = Object.fromEntries(formObject.entries())
    const headers = {
        "Content-Type" : "application/json"
    }
    const status = await makeFetchCall("/recruit/login","POST",headers,formData)
    if (status.success){
        localStorage.setItem("devhire-jwt",status.message.jwt)
    }  
})

companySendCodeButton?.addEventListener("click",async()=>{
    const companyEmail = companySignupForm?.querySelector("#companyEmail")
    const headers = {
        "Content-Type" : "application/json"
    }
    const body = {
        companyEmail : companyEmail.value,
        purpose : "company-sign-up"
    }
    const result = await makeFetchCall("/company/verify-email","POST",headers,body)
    showToast(result.message)
})

companySignupForm?.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const formObject = new FormData(companySignupForm)
    const formData = Object.fromEntries(formObject.entries())
    formData.purpose = "company-sign-up"
    formData.company = true
    const headers = {
        "Content-Type" : "application/json"
    }
    const status = await makeFetchCall("/company/signup","POST",headers,formData)
    if (status.success)
        window.location.href = "login-company.html"
})

companyLoginForm?.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const formObject = new FormData(companyLoginForm)
    const formData = Object.fromEntries(formObject.entries())
    const headers = {
        "Content-Type" : "application/json"
    }
    const status = await makeFetchCall("/company/login","POST",headers,formData)
    if (status.success){
        localStorage.setItem("devhire-jwt",status.message.jwt)
    }  
})

forgotPasswordSendCodeButton?.addEventListener("click",async()=>{
    const email = forgotPasswordForm?.querySelector("#email")
    if (!email.checkValidity()){
        showToast("Enter a valid email address!")
        return
    }
    const headers = {
        "Content-Type" : "application/json"
    }
    const body = {}
    if (companyCheckbox.checked){
            body.email = email.value,
            body.company = true,
            body.purpose = "reset-password"
    } else {
        body.email = email.value,
        body.purpose = "reset-password"
    }
    const result = await makeFetchCall("/forgot-password","POST",headers,body)
    showToast(result.message)
})

forgotPasswordForm?.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const formObject = new FormData(forgotPasswordForm)
    const formData = Object.fromEntries(formObject.entries())
    formData.purpose = "reset-password"
    if (companyCheckbox.checked)
        formData.company = true
    const headers = {
        "Content-Type" : "application/json"
    }
    const status = await makeFetchCall("/reset-password","POST",headers,formData)
    if (status.success)
        window.history.back()
})