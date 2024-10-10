import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity
from bs4 import BeautifulSoup as bs
import requests
from urllib.parse import urlparse
import sys
import json
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='sklearn')


model = joblib.load('m.pkl')
tfidf = joblib.load('tfidf_vectorizer.pkl')
le = joblib.load('label_encoder.pkl')

df = pd.read_csv('new_data.csv')

def process_website(web):
    prediction = ''
    is_match = (df['website_url'] == web).any()
    if not is_match:
        try:
          r = requests.get(web).content
        except:
          return {"error": "Connection Error!"}
        name = "".join(urlparse(web).netloc.split(".")[-2])
        soup = bs(r, "lxml")
        tags = soup.find_all(lambda tag: (tag.name == "meta") & (tag.has_attr('name') & (tag.has_attr('content'))))
        content = [str(tag["content"]) for tag in tags if tag["name"] in ['keywords', 'description']]
        tags = soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])
        text = [" ".join(tag.stripped_strings) for tag in tags]
        content = ' '.join(content) + ' '.join(text)
        t = tfidf.transform([content])
        pred = le.inverse_transform(model.predict(t))
        prediction = pred[0]
        df.loc[len(df.index)] = [web, content, pred[0], name]
        df.to_csv("new_data.csv", index=False)

    else:
        row = df[df['website_url'] == web]
        res_list = row.to_dict(orient='records')
        prediction = res_list[0]["Category"]

    cosine_similarity_matrix = cosine_similarity(tfidf.transform(df['cleaned_website_text']))
    similarity_df = pd.DataFrame(cosine_similarity_matrix, index=df['website_url'], columns=df['website_url'])
    index = similarity_df.index.get_loc(web)
    top_10 = similarity_df.iloc[index].sort_values(ascending=False)[1:11]
    similarity_values = top_10.values.tolist()  
    sim_values = [int(value * 100) for value in similarity_values]
    return {"prediction": prediction, "top_10_similar": top_10.index.tolist(), "top_10_values": sim_values}

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    web_url = input_data.get("url")
    result = process_website(web_url)
    print(json.dumps(result))
