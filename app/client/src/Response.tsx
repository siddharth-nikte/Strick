import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import React from 'react';

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

interface compProp {
    webUrl: string;
    webName: string;
    webValues: number;
};

type responseProp = {
    responseData: predictionData;
}

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
    marginBottom: '3%',
    ...theme.typography.body2,
    textAlign: 'left',
}));

const Comp: React.FC<compProp> = ({ webUrl, webName, webValues }) => {
    const scoreColor = webValues > 40 ? '#27ae60' : '#c0392b';
    return (
        <ThemeProvider theme={theme}>
            <DemoPaper square={false} elevation={3} sx={{
                border: '1px solid transparent',
                ":hover": {
                    borderColor: '#FFFFFF',
                    borderWidth: '1px',
                },
            }}>
                <Grid container spacing={2}>
                    <Grid size={9}>
                        <a href={webUrl} target='_blank'> <Typography variant='subtitle2' color='#0abde3' sx={{ textDecoration: 'underline' }}>{webUrl}</Typography> </a>
                        <Typography variant='h4' color='gray'>{webName}</Typography>
                    </Grid>
                    <Grid size={3}>
                        <Typography color='gray'>Similarity Score</Typography>
                        <Typography color={scoreColor} textAlign={'center'}>{webValues}%</Typography>
                    </Grid>
                </Grid>
            </DemoPaper>
        </ThemeProvider>
    )
}

const Response: React.FC<responseProp> = ({ responseData }) => {
    return (
        <>
            <Grid size={12} marginBottom={3} marginTop={3}>
                <Typography variant="h6" color='grey'> Category: <Typography variant='h6' component='span' color='blue'>{responseData.category}</Typography>  </Typography>
            </Grid>
            <Grid size={12} container justifyContent={'center'} alignItems={'center'}>
                {
                    responseData.websiteArray.map((element, index) => (
                        <Comp webUrl={element} webName={responseData.websiteName[index]}  webValues = {responseData.websiteValues[index]}/>
                    ))
                }
            </Grid>
        </>

    );
};

export default Response;