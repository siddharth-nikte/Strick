from bs4 import BeautifulSoup as bs
import requests
from urllib.parse import urlparse
from multiprocessing import Pool

web = ''
count = 0
pool = Pool()
#Connection
def connect(count, loc):
  if(count < 5):
    try:
      r= requests.get(loc).content
      return r
    except:
      print("Retrying")
      count += 1
      connect(count, loc)
  else:
    count = 0
    print("Connection failed")
    return("")

def connect1(count, loc):
  if(count < 5):
    try:
      r= requests.get(loc)
      return r
    except:
      print("Retrying")
      count += 1
      connect(count, loc)
  else:
    count = 0
    print("Connection failed")
    return("")

#Metadata
def getMetadata(count):
  if(count == 5):
    count = 0
    return "Error getting metadata"
  tags = soup.find_all(lambda tag: (tag.name=="meta") & (tag.has_attr('name') & (tag.has_attr('content'))))
  content = [str(tag["content"]) for tag in tags if tag["name"] in ['keywords','description']]
  tags = soup.find_all(["h1","h2","h3","h4","h5","h6"])
  text = [" ".join(tag.stripped_strings) for tag in tags]
  content = ' '.join(content) + ' '.join(text)
  if(content != ''):
    with open("metadata.txt", "w") as file:
      file.write(content)
    return "Metadata saved successfully"
  else:
    print("Retrying")
    count += 1
    return getMetadata(count)

def download(media_urls):
    for i in media_urls:
      response = connect1(count, i)
      if(response == ''):
        return "Error downloading"
      image_filename = i.split("/")[-1]
      with open(image_filename, "wb") as file:
        file.write(response.content)
    return "Downloaded succesfully"

#Tested for google images, bing images, unsplash, theplace-2
def getImages(count):
  if(count == 5):
    count = 0
    return "Error getting images or no images found"
  media_elements = soup.find_all('img')
  if len(media_elements) == 0:
    return "Error getting media"
  else:
    media_urls = []
    for i in media_elements:
      t = i.get('src')
      if(t is not None):
        if(t.find('http') == -1):
          media_urls += [base_url+t]
        elif (t.find('jpeg;base64')):
          media_urls += [t.split('data:image/jpeg;base64,')[0]]
        else:
          media_urls += [t]
    if len(media_urls) != 0:
      return download(media_urls)
    else:
      print("Retrying")
      count += 1
      return getImages(count)

#Tested for arxiv, google scholar
def getPDF(count):
  if(count == 5):
    count = 0
    return "Error getting pdfs or no pdf found"
  tag = soup.find_all('a')
  media_urls = []
  for i in tag:
    if 'href' in i.attrs:
      t = i['href']
      if 'pdf' in t:
        if(t.find('http') == -1):
          media_urls += [base_url+t]
        else:
          media_urls += [t]
  if len(media_urls) != 0:
    return download(media_urls)
  else:
    print("Retrying")
    count += 1
    return getPDF(count)

r = connect(count, web)
if(r != None):
  parsed_url = urlparse(web)
  name = "".join(parsed_url.netloc.split(".")[-2])
  base_url = parsed_url.scheme + "://" + parsed_url.netloc
  soup = bs(r, "lxml")
  resMetadata = pool.apply_async(getMetadata, [count])
  resImage = pool.apply_async(getImages, [count])
  resPDF = pool.apply_async(getPDF, [count])
  print(resMetadata.get())
  print(resImage.get())
  print(resPDF.get())