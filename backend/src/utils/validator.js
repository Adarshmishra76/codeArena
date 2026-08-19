const validator=require("validator");

const validate=(data)=>{
   const mandatoryField=['firstName',"emailId",'password'];

   const IsAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));

   if(!IsAllowed)
    throw new Error("Some field Missing");
   
   if(!validator.isEmail(data.emailId))
    throw new Error("invalid Email");

   if(!validator.isStrongPassword(data.password))
    throw new Error("week Password");
 

}

module.exports=validate;