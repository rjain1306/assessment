
import './App.css';
import Card from './components/Card';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function App() {
  const [users, setUsers] = useState();
  const [cardArr, setCardArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLogs, setUserLogs] = useState();
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    getUsers();
  }, [sortBy])

  // get all users.
  const getUsers = async () => {
    setLoading(true);
    try {
      let query = '';
      if(sortBy === 'name'){
        query = '?sort%5B0%5D%5Bfield%5D=Name'
      }
      const response = await axios.get('https://api.airtable.com/v0/appBTaX8XIvvr6zEC/Users' + query, {
        headers: {
          'Authorization': `Bearer key4v56MUqVr9sNJv` 
        }
      });
      setUsers(response?.data?.records);
      const users = response?.data?.records;
      await getUserLogs(users);

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  // get user logs.
  const getUserLogs = async (users) => {
    setLoading(true);
    try {
      let cardsArr = [];
      const response = await axios.get('https://assets.interviewhelp.io/INTERVIEW_HELP/reactjs/logs.json');
      // setUserLogs(response?.data);
      const userLogs = response.data;
      users.forEach((u) => {
        const user = u.fields;
        const filteredUserLogs = userLogs?.filter((l) => user.Id === l.user_id);
        
        filteredUserLogs.sort(function(a,b){
          return new Date(b.time) - new Date(a.time);
        });
        const userData = getSum(filteredUserLogs, user);
        cardsArr.push(userData);
      });

      if(sortBy === 'impression'){
        cardsArr.sort(function(a,b){
          return new Date(b.impressionValue) - new Date(a.impressionValue);
        })
      }

      if(sortBy === 'conversion'){
        cardsArr.sort(function(a,b){
          return new Date(b.conversionValue) - new Date(a.conversionValue);
        })
      }

      if(sortBy === 'revenue'){
        cardsArr.sort(function(a,b){
          return new Date(b.revenue) - new Date(a.revenue);
        })
      }

      setCardArr(cardsArr);

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  // get sum of conversion, impression, revenue and conversionCountPerDay.
  const getSum = (userData, user) => {
    let obj = {};
    let arrConversionByDay = [];
    let conversionValue = 0;
    let impressionValue = 0;
    let revenue = 0;
    userData.forEach((item, index) => {
      const date = item.time.split(" ")[0];
      Object.assign(obj, { [date]: JSON.stringify(obj[date]) ?  userData[index].type === "conversion" ? obj[date] + 1: obj[date] : 0 });
      
      if(item.type === 'conversion'){
        conversionValue = conversionValue + 1;
      } else if (item.type === 'impression') {
        impressionValue = impressionValue + 1;
      }
      revenue = revenue + item.revenue;
    })
    arrConversionByDay = Object.keys(obj).map(function (key) {
      return {date: key, count: obj[key]};
    });

    user.conversionValue = conversionValue;
    user.impressionValue = impressionValue;
    user.revenue = revenue;
    user.minDate = new Date(userData[userData.length - 1].time);
    user.maxDate = new Date(userData[0].time);
    user.arrConversionByDay = arrConversionByDay;
    
    return user;
  }

  const handleChange = (event) => {
    setSortBy(event.target.value);
    setUserLogs("");
    setUsers("");
  }
  return (
    <>
    <div className="App">
      <div style={{ display: 'flex', placeContent: 'center'}}>
        <Typography style={{ margin: '10px', padding: '10px', alignSelf: 'center'}}>Sorting by</Typography>
        <div style={{ margin: '10px', padding: '10px'}}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Sort</InputLabel>
          <Select
            value={sortBy}
            label="Sort"
            onChange={handleChange}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="impression">Impression</MenuItem>
            <MenuItem value="conversion">Conversion</MenuItem>
            <MenuItem value="revenue">Revenue</MenuItem> 
          </Select>
        </FormControl>
        </div>
      </div>
      <div className="cards">
        {!loading ?
          cardArr.map((user) => {
            return <Card key={user.Id} user={user}/>
          })
          : <div> <h1>loading...</h1></div>
        }
      </div>
    </div>
    </>
  );
}

export default App;
