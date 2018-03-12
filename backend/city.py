import textprocessing
import dboperations
import tweepy
import json
import pprint
import time
import datetime
from config import API
from textblob import TextBlob

class City:
    cityCount = 0

    def __init__ (self, name, lat, longt, radius, collection, geobox):
        self.name = name
        self.lat = lat
        self.longt = longt
        self.radius = radius
        self.collection = collection
        self.geobox = geobox
        self.polarity = 0
        City.cityCount += 1

    def geocode_to_str(self):
        return str(self.lat) + ',' + str(self.longt) + ',' + str(self.radius) + "km"

    def search_for_tweets_and_save(self):
        tweets = tweepy.Cursor(API.search, q="*", lang="en",
                               geocode=self.geocode_to_str()).items(30)
        dboperations.save_tweets(tweets, self.collection)
        print "I've worked!"
        time.sleep(10)

    def get_tweets_by_date(self, date):
        return dboperations.get_tweets(self.collection, date)

    def get_array_of_moods (self):
        array_of_moods = []
        for num in range (0,7):
            date = (datetime.datetime.today() -
                    datetime.timedelta(num)).strftime('%Y-%m-%d')
            weekday = datetime.datetime.strptime(date,                      '%Y-%m-%d').strftime('%A')
            array_of_moods.append((weekday, self.find_mood_by_date(date)))
        return array_of_moods


    def count_tweets(self):
        print self.name + " has " + str(dboperations.count_tweets(self.collection)) + " tweets!"

    def print_tweets(self, date):
        for tweet in self.get_tweets_by_date(date):
            pprint.pprint(tweet)
            print '+++++++++++++++++++++++++++++++++++++++++++'

    def find_mood_by_date(self, date):
        aggregate_text = ""
        for tweet in self.get_tweets_by_date(date):
            tokens = textprocessing.process_or_store(tweet['text'])
            for token in tokens:
                aggregate_text += " " + token
                aggregate_text += '\n'
        mood = textprocessing.find_sentiment_polarity(aggregate_text)
        return mood

    def find_trends(self):
        trends = []
        places = API.trends_closest(self.lat, self.longt)
        for place in places:
            trends.append(API.trends_place(place['woeid']))
        return trends

    def print_mood(self, date):
        print self.name + " mood: " + str(City.find_mood_by_date(self, date))

    def print_hashtags(self):
        hashtags = []
        trends = self.find_trends()
        for trend in trends:
            list_of_trends = [x['name'] for x in trend[0]['trends']
                              if x['name'].startswith('#')]
            return list_of_trends [:3]
