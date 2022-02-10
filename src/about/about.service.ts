import { Injectable } from '@nestjs/common';

@Injectable()
export class AboutService {
  getAbout(req): object {
    return {
      client: { host: req.ip },
      server: {
        current_time: Math.round(Date.now() / 1000),
        services: [
          {
            name: 'teams',
            actions: [
              {
                name: 'tagged_in_msg',
                description: 'User has been tagged in a message',
              },
            ],
          },
          {
            name: 'twitter',
            actions: [
              {
                name: 'new_message_inbox',
                description: 'User has received a private message',
              },
              {
                name: 'tagged_in_tweet',
                description:
                  'User has been tagged by a user with more than N followers',
              },
              {
                name: 'user_is_retweeted',
                description:
                  'User has been retweeted by an account with more than N followers',
              },
            ],
            reactions: [
              { name: 'follow_user', description: 'Follows a user on Twitter' },
              { name: 'post_tweet', description: 'Posts a new tweet' },
            ],
          },
          {
            name: 'google_calendar',
            actions: [
              {
                name: 'new_meeting_created',
                description: 'A new meeting is created in calendar',
              },
            ],
            reactions: [
              {
                name: 'create_calendar_event',
                description: 'Creates a new calendar event',
              },
            ],
          },
          {
            name: 'onedrive',
            actions: [
              {
                name: 'new_meeting_created',
                description: 'A new meeting is created in calendar',
              },
              {
                name: 'new_todo_task',
                description: 'New todo task has been assigned to user',
              },
            ],
            reactions: [
              { name: 'create_todo_task', description: 'Adds a new todo task' },
              {
                name: 'create_calendar_event',
                description: 'Creates a new calendar event',
              },
            ],
          },
          {
            name: 'github',
            actions: [
              {
                name: 'actions_finished',
                description: 'A Github actions has finished',
              },
              {
                name: 'issue_closed',
                description: 'A Github issue has been closed',
              },
              {
                name: 'issue_created',
                description: 'A Github issue has been created',
              },
              {
                name: 'repo_starred',
                description: 'A Github repo has been created',
              },
              {
                name: 'milestone_created',
                description: 'A Github milestone has been created',
              },
            ],
          },
        ],
      },
    };
  }
}
