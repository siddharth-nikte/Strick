# Strike

Content based recommendation system and website classifier.

It uses text data and URL scraped from website meta-tags to train a classification model and generate a similarity score of other websites within the dataset.  

## Demo  
https://github.com/user-attachments/assets/0cace2d7-e468-4114-8722-7d42f7054510

## Architecture
### Dataset and Data Cleaning
[Original dataset](https://www.kaggle.com/datasets/hetulmehta/website-classification)\
The original dataset contains website URL, website text and classification. A cleaner version of dataset is used to modify values.

### Classification Model
Text features are converted to vectors by implementing TF-IDF and passed to LinearSVC as training data.

### Data Extraction and Recommendation System
Website meta-data is extracted using BeautifulSoup and Cosine Similarity is used to find similarity score.

### Website Scraper
Website scraper is a python script to scrape and images and pdfs from websites. Features: Error handling, automated retries and parallelization.

### User Interface
ReactJS with MaterialUI acts as a frontend while NodeJS, connects the UI with python model.

## Installation
This project requires Python and the following Python libraries installed:\
Pandas\
seaborn\
scikit-learn\
BeautifulSoup\
urllib.parse

You will also need to have software installed to run and execute a Jupyter Notebook.

To run the app:  
1. Install ReactJS dependencies  
cd app/client  
npm i  
npm run dev  

2. Install NodeJS dependencies  
cd app/server  
npm i  
node index
