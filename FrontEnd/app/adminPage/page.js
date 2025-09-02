'use client';
import { apiLink, handleAdminData } from '@/API/API CALLS';
import U_Button from '@/Components/Button';
import Sppiner from '@/Components/Spiner';
import Image from 'next/image';
import { useEffect, useState } from 'react';


export default function Page() {

  const [email, setEmail] = useState();
  const [approval, setApproval] = useState(false);
  const [header, setHeader] = useState('');
  const [reject, setReject] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [reloadApproveData, setReloadApproveData] = useState(false);

  useEffect(() =>{
  getUserData();
  },[])

  async function getUserData() {
   try{
      const aData = await handleAdminData();
      if(aData)
      {
        setAdminData(aData.message.attentionAccount);
      } else{
        console.log("No data avaliable");
      }
   }catch(err){
throw new Error("Failed to get the data " + err.message);
   }
    
  }

  function handleApproval(userEmail) {
    setEmail(userEmail);
    setApproval(true);
  }

  function CancleBox() {
    setApproval(false);
    setEmail('');
    setReject(false);
    setReloadApproveData((prev) => !prev);
  }
  return (
    <div className="bg-white w-full h-full">
      {adminData?.length > 0 ? (
        <div className="w-full h-full p-8">
          {approval && (
            <ApprovalBox
              CancleBox={CancleBox}
              email={email}
              header={header}
              reject={reject}
            />
          )}
          <table className="border-8 border-collapse border-green-500 w-full h-1/5">
            <caption className="caption-top">
              <h1 className="font-bold mb-8"> User waiting for Approval</h1>
            </caption>
            <tr className="border-2">
              <th className="border-2 border-green-300">Profile Picture</th>

              <th className="border-2 border-green-300">First Name</th>
              <th className="border-2 border-green-300">Last Name</th>
              <th className="border-2 border-green-300">Email</th>
              <th className="border-2 border-green-300">Action</th>
            </tr>

            {adminData.map((items) => (
              <tr key={items.id} className="text-center h-[100px]">
                <td className="border-2 border-green-100">
                  <div className="flex justify-center">
                    <Image
                      className="rounded-full"
                      src={items.imageLink.replace('}', ' ')}
                      height={100}
                      width={100}
                      alt="User image"
                    />
                  </div>
                </td>

                <td className="border-2 border-green-100">{items.firstName}</td>
                <td className="border-2 border-green-100">{items.lastName}</td>
                <td className="border-2 border-green-100">{items.email}</td>
                <td className="border-2 border-green-300">
                  {!approval && (
                    <div className="flex gap-5 justify-center">
                      <U_Button
                        b_name={'Approve'}
                        b_function={(e) => {
                          handleApproval(items.email);
                          setHeader('Approve Account?');
                          setReject(false);
                        }}
                      />
                      <U_Button
                        b_name={'Reject'}
                        red={true}
                        b_function={(e) => {
                          handleApproval(items.email);
                          setHeader('Reject Account?');
                          setReject(true);
                        }}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </table>
        </div>
      ) : (
        <div className="h-full font-bold uppercase flex justify-center items-center text-3xl">
          Nothing to approve
        </div>
      )}
    </div>
  );
}

function ApprovalBox({ CancleBox, email, header, reject }) {
  const [modelOpen, setModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    setModelOpen(true);
  }, []);

  async function HandleApprove() {
    const token = sessionStorage.getItem('cookies');
    try {
      setLoading(true);
      const response = await fetch(
        `${apiLink}/users/admin/approval/${email}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: email }),
        }
      );
      if (!response.ok) {
        setLoading(false);
        throw new Error('Something went wrong');
      }
      const data = await response.json();
      setLoading(false);
      CancleBox();
    } catch (err) {
      setLoading(false);
      throw new Error('Failed to approve the account');
    }
  }

  async function HandleRejectAccount() {
    console.log('rejecting');
    const token = sessionStorage.getItem('cookies');
    try {
      setLoading(true);
      const response = await fetch(`${apiLink}/users/admin/reject/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) {
        setLoading(false);
        const errMessage = await response.json();
        throw new Error('Something went wrong ' + errMessage.message);
      }
      const data = await response.json();
      setLoading(false);
      CancleBox();
    } catch (err) {
      setLoading(false);
      throw new Error('Failed to Delete the account ' + err);
    }
  }
  return (
    <>
      <div
        className={`absolute flex justify-center items-center ml-96 h-2/5 p-10 w-2/5 ${
          modelOpen ? 'scale-100' : 'scale-0'
        } transition duration-500 ease-in-out`}
      >
        <div className="w-full h-full rounded-[50px] bg-gradient-to-t from-green-300 via-green-500 to-green-300">
          {!loading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <div className=" mt-10 flex items-center border-b-2 ">
                <div className="flex flex-col font-bold">
                  <span>{header}</span>
                  <span className="text-slate-500">Are you sure? </span>
                </div>
              </div>
              <span className="font-bold">
                {header.split(' ')[0]} Email: {email}
              </span>
              <div
                className={`flex w-full mt-5 p-2 ${
                  failed ? 'text-red-500' : 'text-white'
                }`}
              >
                <span>{response}</span>
              </div>
              <div className="flex gap-2 justify-center items-center h-full">
                <U_Button
                  b_name={'Yes'}
                  b_function={!reject ? HandleApprove : HandleRejectAccount}
                />
                <U_Button
                  b_name={'Cancel'}
                  red={'true'}
                  b_function={(e) => CancleBox()}
                />
              </div>
            </div>
          ) : (
            <Sppiner Size="p-20" />
          )}
        </div>
      </div>
    </>
  );
}
