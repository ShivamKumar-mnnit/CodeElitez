import styled from 'styled-components'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import {Navbar} from '../components/homepage/Navbar'

const Container = styled.div`
height:100%;
margin: 4% 7%;
`
const Table = styled.table`
font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
`
const Td = styled.td`
border: 1px solid #ddd;
  padding: 8px;
`
const Th = styled.th`
    border: 1px solid #ddd;
  padding: 12 8px;
  text-align: left;
  background-color: #393E46;
  color: #EEEEEE; 
`
const Tr = styled.tr`
&:nth-child(even){
    background-color: #f2f2f2;
}
&:hover {
    background-color:#ddd;
  }
`
const Header = styled.h1`
  text-align:center;
  padding-bottom:10px;
  colot:#222831;
`
const Button = styled.button`
background-color:#393E46;
color:#EEEEEE;
border:none;
border-radius:15px;
font-size:14px;
cursor: pointer;
`

const Reports = (CUId) => {
  const navigate = useNavigate();
  
  console.log(CUId);

  const [userDatas, setUserDatas] = useState([]);
  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(true);
  const [examDatas, setExamDatas] = useState([]);
  const [imageData,setImageData]= useState("");

const token = localStorage.getItem('token');

  useEffect(() => {
    getUserDatas();
    getExamDatas()
    // eslint-disable-next-line
  }, [])

  const getUserDatas = async () => {
    const { data } = await axios.get(`http://localhost:8080/userexams/`+CUId.CUId,{ headers: { Authorization: `Bearer ${token}` } });
    console.log(data);
    setUserDatas(data)
    setIsLoading(false);
  }

  const getExamDatas = async () => {
    await axios.get(`http://localhost:8080/exam`,{ headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      setExamDatas(response.data)
      console.log(response.data)
      setIsLoading(false)
    })
  }


 

if(isLoading){
  return(
  <>loading...</>
  )
}
console.log(CUId)
  return (
    <>
  <Navbar/>
      <Container>
        <Header>Status report</Header>
        <Table>
          <Tr>
            <Th>S.no</Th>
            <Th>Exam Name</Th>
            <Th>Link</Th>
            <Th>Status</Th>
            <Th>Result</Th>
          </Tr>
          {examDatas.map((exam, index) => (
            <Tr key={index}>
              <Td>{index+1}</Td>
              <Td>{exam.examname}</Td>
              <Td><Link to={`/examstarting/${exam._id}`}><Button>Go to exam</Button></Link></Td>
              <Td>
  {exam.examGivers.includes(CUId.CUId) ? (
    <span style={{ border: "none", borderRadius: "10px", padding: "5px", backgroundColor: "#CC0000", color: "#EEEEEE", fontWeight: "500" }}>
      {"Solved"}
    </span>
  ) : (
    <span style={{ border: "none", borderRadius: "10px", padding: "5px", backgroundColor: "#007E33", color: "#EEEEEE", fontWeight: "500" }}>
      {"Available"}
    </span>
  )}
</Td>
{userDatas[index]?.status &&
<img src={userDatas[index].status} alt="Result not published yet" />
}
            </Tr>
          ))}
        </Table>


      </Container>
 
    </>
  )
}

export default Reports