import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { LineChart, Line } from 'recharts';

export default function RecipeReviewCard(props) {
  const user = props.user;  

  const r = () => Math.random() * 256 >> 0;

  return (
    <div>
    <Card sx={{ width: 345 , margin: 2, padding: 2, border: "2px solid", borderRadius: "10px"}}>
      <CardHeader
      sx={{ padding: 0 }}
        avatar={
          <Avatar sx={{ bgcolor:  `rgb(${r()}, ${r()}, ${r()})`, width: 56, height: 56 }}  src={user.avatar} aria-label="recipe">
            {user.Name.split(" ").shift().charAt(0)}
          </Avatar>
        }
        title={user.Name}
        titleTypographyProps={{variant:'h6' }}
        subheader={user.occupation}
      />
      
      <CardContent style={{display: 'flex', justifyContent: 'space-between'}} >
        <div>
            <LineChart width={120} height={120} data={user.arrConversionByDay}>
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
            <div>
                conversion {user.minDate.getDate() + "/" + ( user.minDate.getMonth() + 1 )} - {user.maxDate.getDate() + "/" + (user.maxDate.getMonth() + 1)} 
            </div>
        </div>
        <div style={{ textAlign: 'end', padding: 0}}>
            <Typography variant="body1" color="orange">
            {user.impressionValue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Impression
            </Typography>
            <Typography variant="body1" color="blue">
            {user.conversionValue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Conversion
            </Typography>
            <br/>
            <Typography variant="h6" color="green">
            ${(user.revenue).toFixed(2)}
            </Typography>
        </div>

      </CardContent>
    </Card>
    </div>
  );
}
