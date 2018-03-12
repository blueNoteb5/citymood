import tweepy
from tweepy import OAuthHandler
import yweather

CLIENT = yweather.Client()

CONSUMER_KEY = ''
CONSUMER_SECRET = ''
ACCESS_TOKEN = ''
ACCESS_SECRET = ''

AUTH = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
AUTH.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)

API = tweepy.API(AUTH, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
