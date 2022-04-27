# Paperboy

Paperboy is a Discord bot that helps run the newsletter I maintain, [Until It's Not Fun](https://untilitsnotfun.com). Paperboy currently has one slash command `/latest` that returns a link to our latest post. It is also tied into [Buttondown's](https://buttondown.email) API to send a message to a channel when the email gets sent out each week.

## Deployment

Paperboy lives on Google Cloud Platform's Cloud Run. It is a serverless platform that connects nicely with Secret Manager to hold tokens and such. It also integrates seamlessly with Cloud Build. Cloud Build can be configured to trigger a build whenever there is a push to main on a GitHub repo. That is exactly what I did to make my life that much easier and to be able to make changes on the fly. Push to main and I know that those changes will be reflected in the Discord channel within minutes.

## Contributing

Paperboy fulfills a very specific role so there is not much to contribute here. However, if you want to start your own email newsletter and want to use this piece of the workflow, you just need to clone paperboy, change some environment variables, and deploy! If you want to see the other part of our newsletter workflow, [check it out here](https://github.com/Westley-Winks/until-its-not-fun-newsletter)!