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
                        name: 'twitter',
                        reactions: [
                            { 
                                name: 'follow', 
                                description: 'Follows a user on Twitter' 
                            },
                            { 
                                name: 'tweet', 
                                description: 'Posts a new tweet' 
                            },
                            { 
                                name: 'retweet', 
                                description: 'Retweet a tweet' 
                            },
                            { 
                                name: 'like', 
                                description: 'Like a tweet' 
                            },
                        ],
                    },
                    {
                        name: 'mail',
                        reactions: [
                            {
                                name: 'mail',
                                description: 'Send a mail to a specific amil adress',
                            },
                        ],
                    },
                    {
                        name: 'Discord',
                        reactions: [
                            {
                                name: 'message',
                                description: 'Send a message on a specific channel from a specific server',
                            },
                        ],
                    },
                    {
                        name: 'github',
                        actions: [
                            {
                                name: 'pull_request',
                                description: 'A Github actions has been requested',
                            },
                            {
                                name: 'issue_comment',
                                description: 'A Github issue has been commented',
                            },
                            {
                                name: 'issue',
                                description: 'A Github issue has been created',
                            },
                            {
                                name: 'label',
                                description: 'A Github label has been updated',
                            },
                            {
                                name: 'milestone_created',
                                description: 'A Github milestone has been created',
                            },
                            {
                                name: 'push',
                                description: 'A Github milestone has been pushed',
                            },
                        ],
                    },
                    {
                        name: 'codebase',
                        actions: [
                            {
                                name: 'Push',
                                description: 'A Codebase actions has been pushed',
                            },
                            {
                                name: 'merge_request',
                                description: 'A Github issue has been merged',
                            },
                            {
                                name: 'ticket_creation',
                                description: 'A Github issue has been created',
                            },
                            {
                                name: 'ticket_update',
                                description: 'A Github repo has been updated',
                            },
                        ],
                    },
                    {
                        name: 'Gitlab',
                        actions: [
                            {
                                name: 'Push',
                                description: 'A Gitlab actions has been pushed',
                            },
                            {
                                name: 'merge_request',
                                description: 'A Gitlab issue has been merged',
                            },
                            {
                                name: 'Issue',
                                description: 'A Gitlab issue has been created',
                            },
                            {
                                name: 'comment',
                                description: 'A Gitlab repo has been commented',
                            },
                            {
                                name: 'wiki',
                                description: 'A wiki page has been opened',
                            },
                        ],
                    },
                ],
            },
        };
    }
}
