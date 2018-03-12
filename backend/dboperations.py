import time
import datetime
from pymongo import MongoClient

CLIENT = MongoClient('localhost', 27017)
DB = CLIENT.tweetsdb

def save_tweets(tweets, collection):
    for tweet in tweets:
        tweet_simplified = {"text": tweet._json['text'],
                            "created_at" : convert_date_time(tweet._json['created_at'])}
        collection.insert_one(tweet_simplified)
        print tweet_simplified["created_at"] + " " + tweet_simplified["text"]

def get_tweets(collection, date):
    tweets = []
    for tweet in collection.find({"created_at" : date}):
        tweets.append(tweet)
    return tweets

def count_tweets(collection):
    return collection.count()

def convert_date_time (tweet_date):
    time_stamp = time.strftime('%Y-%m-%d', time.strptime(tweet_date, '%a %b %d %H:%M:%S +0000 %Y'))
    return time_stamp
