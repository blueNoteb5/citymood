import json
import re
import operator
from collections import Counter
from nltk.corpus import stopwords
import string
from textblob import TextBlob

emoticons_str = r"""
    (?:
        [:=;] # Eyes
        [oO\-]? # Nose (optional)
        [D\)\]\(\]/\\OpP] # Mouth
    )"""

regex_str = [
    emoticons_str,
    r'<[^>]+>', # HTML tags
    r'(?:@[\w_]+)', # @-mentions
    r"(?:\#+[\w_]+[\w\'_\-]*[\w_]+)", # hash-tags
    r'http[s]?://(?:[a-z]|[0-9]|[$-_@.&amp;+]|[!*\(\),]|(?:%[0-9a-f][0-9a-f]))+', # URLs

    r'(?:(?:\d+,?)+(?:\.?\d+)?)', # numbers
    r"(?:[a-z][a-z'\-_]+[a-z])", # words with - and '
    r'(?:[\w_]+)', # other words
    r'(?:\S)' # anything else
]

tokens_re = re.compile(r'('+'|'.join(regex_str)+')', re.VERBOSE | re.IGNORECASE)
emoticon_re = re.compile(r'^'+emoticons_str+'$', re.VERBOSE | re.IGNORECASE)

def tokenize(s):
    return tokens_re.findall(s)

def preprocess(s, lowercase=False):
    tokens = tokenize(s)
    if lowercase:
        tokens = [token if emoticon_re.search(token) else token.lower() for token in tokens]
    return tokens

def process_or_store(text):
    tweet_term_list = preprocess (text)
    return tweet_term_list

def find_sentiment_polarity(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

def find_most_used_terms (tweets):
    punctuation = list (string.punctuation)
    stop = stopwords.words('english') + punctuation + ['rt', 'via']
    counter = Counter()
    for tweet in tweets:
        terms_stop = [term for term in preprocess(tweet['text']) if term not in stop]
        print terms_stop
        counter.update(terms_stop)
    return counter.most_common(5)
