import { Repeater } from '@graphql-yoga/subscription';
import { DevService } from '../services/dev.service';

export const timeSubscription = {
	subscribe: () =>
		new Repeater((push, stop) => {
			const interval = setInterval(() => {
				push(new Date().toISOString());
			}, 1000);
			stop.then(() => clearInterval(interval));
		}),
	resolve: (time: string) => time,
}

export const helloQuery = () => DevService.getDevService();