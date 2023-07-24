const { StatusCodes } = require('http-status-codes')
const { catchAsync } = require('../middleware/errors')
const {signin,signup,getAllParticipatedhackathons,getEmployeeByEmailService,updateEmployeeService,deleteEmployeeService} = require('../services/employeeService')

const employeeLogin = catchAsync(async(req,res) => {
    try{
    const data = await signin(req,res);
    res.status(200).send(data);
    }catch(error){
        res.status(500).send(error)
    }
});
const employeeSignUp = async(req,res) => {
    try{
    const data = await signup(req,res);
    res.status(200).send(data);
    }catch(error){
        res.status(500).send(error)
    }
};
const getEmployeeByEmail = catchAsync(async(req,res,next) =>{
  const { email } = req.query
  
  const result = await getEmployeeByEmailService(email)

    res.status(StatusCodes.OK).send(
        { success: true, 
          message: result && result.length ? 'Data Found' : 'Employee not found with email ',
          data: result
        })

  next()
});
const updateEmployee  = catchAsync(async(req,res,next) =>{

  
  const result = await updateEmployeeService(req)
    res.status(StatusCodes.OK).send(
        { success: true, 
          message: result && result.length ? 'Data Found' : 'No Data',
          data: result
        })

  next()
});
const deleteEmployee = catchAsync(async(req,res) =>{
    const result = await deleteEmployeeService(req);
    res.status(StatusCodes.OK).send(
        { success: true, 
          message: result && result.length ? 'Employee Deleted Sucessfully' : 'No Data',
          data: result
        })

});
const getAllParticipatedHackathons = catchAsync(async(req,res) => {
    try{
        const getAllParticipatedHackathons = await getAllParticipatedhackathons(req,res);
        res.status(200).send(getAllParticipatedHackathons);
    }catch(error){
        res.status(500).send(error);
    }

});
module.exports = {getEmployeeByEmail,updateEmployee,deleteEmployee,employeeLogin,employeeSignUp,getAllParticipatedHackathons,deleteEmployee};