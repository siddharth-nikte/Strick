import './App.css'
import Response from './Response'
import { Typography, TextField, Button, Skeleton } from '@mui/material'
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark"
  }
});

type predictionData = {
  category: string;
  websiteArray: string[];
  websiteName: string[];
  websiteValues: number[];
};

function App() {

  const webName: string[] = [];
  const [url, setUrl] = useState<string>('');
  const [urlValid, setUrlValid] = useState<boolean>(true);
  const [compVisible, setCompVisible] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [placeVisible, setPlaceVisible] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<predictionData>({ category: "", websiteArray: [], websiteName: [], websiteValues: [] });

  const sendData = (url: string) => {
    fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
      .then(response => response.json())
      .then(data => {
        const obj = JSON.parse(data.response);
        if (obj.error) {
          setPlaceVisible(false)
          setErrorVisible(true)
        }
        else {
          for (var i = 0; i < 10; i++) {
            const temp = new URL(obj.top_10_similar[i]);
            webName.push(temp.hostname.replace('www.', '').replace('.com', '').replace('.', ''));
          }
          setResponseData({ category: obj.prediction, websiteArray: obj.top_10_similar, websiteName: webName, websiteValues: obj.top_10_values })
          setPlaceVisible(false)
          setCompVisible(true)
          setErrorVisible(false)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleUrl = async (e: any) => {
    e.preventDefault();
    try {
      new URL(url);
      setUrlValid(true);
      sendData(url);
      setPlaceVisible(true)
      setCompVisible(false)
      setErrorVisible(false)
    }
    catch {
      setUrlValid(false);
    }
  }

  return (
    <>
      <Grid container spacing={2} justifyContent={'center'} alignItems={'center'}>
        <Grid size={8}>
          <Typography variant="h2" component="h2" color='red'> Strike </Typography> 
        </Grid>
        <Grid size={6}>
          <ThemeProvider theme={theme}>
            <TextField error={!urlValid} id="outlined-basic" label={urlValid ? "URL" : "Invalid URL"} variant="outlined" fullWidth value={url} onChange={(e) => setUrl(e.target.value)} />
          </ThemeProvider>
        </Grid>
        <Grid size={2}>
          <Button variant='contained' color='success' onClick={handleUrl}>Search</Button>
        </Grid>
        <Grid size={8}>
          {placeVisible && (
            <ThemeProvider theme={theme}>
              <Skeleton variant="rounded"  height={60} sx = {{marginBottom: '10px'}}/>
              <Skeleton variant="rounded"  height={30} sx = {{marginBottom: '10px'}}/>
            </ThemeProvider>
          )}
          {compVisible && (<Response responseData={responseData} />)}
          {errorVisible &&  (
            <Typography variant='h6' component='span' color='blue'>Connection Error or Invalid Website!</Typography>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default App
