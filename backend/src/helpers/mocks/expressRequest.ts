/**
  source: https://github.com/bikk-uk/jest-mock-express

  MIT License
  
  Copyright (c) 2021 bikk.uk
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import type {IncomingMessage} from "http";
import type {Readable} from "stream";

// Types
import type {Request} from "express";

/**
 * Returns a mocked **Express** `Request` with mocked functions and default values.
 */
export const expressRequest = <T extends Request>(values: MockRequest = {}): T => {
	const {
		/* express.Request */
		params = {},
		query = {},
		body = {},
		cookies = {},
		method = "",
		protocol = "",
		secure = false,
		ip = "",
		ips = [],
		subdomains = [],
		path = "",
		hostname = "",
		host = "",
		fresh = false,
		stale = false,
		xhr = false,
		route = {},
		signedCookies = {},
		originalUrl = "",
		url = "",
		baseUrl = "",
		accepted = [],
		get = jest.fn().mockName("get mock default"),
		header = jest.fn().mockName("header mock default"),
		accepts = jest.fn().mockName("accepts mock default"),
		acceptsCharsets = jest.fn().mockName("acceptsCharsets mock default"),
		acceptsEncodings = jest.fn().mockName("acceptsEncodings mock default"),
		acceptsLanguages = jest.fn().mockName("acceptsLanguages mock default"),
		range = jest.fn().mockName("range mock default"),
		param = jest.fn().mockName("param mock default"),
		is = jest.fn().mockName("is mock default"),
		app = {},
		res = jest.fn().mockName("res mock default"),
		next = jest.fn().mockName("next mock default"),

		/* http.IncomingMessage */
		aborted = false,
		httpVersion = "",
		httpVersionMajor = 0,
		httpVersionMinor = 0,
		complete = false,
		connection = {},
		socket = {},
		headers = {},
		rawHeaders = [],
		trailers = {},
		rawTrailers = [],
		setTimeout = jest.fn().mockName("setTimeout mock default"),
		statusCode = 0,
		statusMessage = "",
		destroy = jest.fn().mockName("destroy mock default"),

		/* stream.Readable */
		readable = false,
		readableHighWaterMark = 0,
		readableLength = 0,
		readableObjectMode = false,
		destroyed = false,
		_read = jest.fn().mockName("_read mock default"),
		read = jest.fn().mockName("read mock default"),
		setEncoding = jest.fn().mockName("setEncoding mock default"),
		pause = jest.fn().mockName("pause mock default"),
		resume = jest.fn().mockName("resume mock default"),
		isPaused = jest.fn().mockName("isPaused mock default"),
		unpipe = jest.fn().mockName("unpipe mock default"),
		unshift = jest.fn().mockName("unshift mock default"),
		wrap = jest.fn().mockName("wrap mock default"),
		push = jest.fn().mockName("push mock default"),
		_destroy = jest.fn().mockName("_destroy mock default"),
		addListener = jest.fn().mockName("addListener mock default"),
		emit = jest.fn().mockName("emit mock default"),
		on = jest.fn().mockName("on mock default"),
		once = jest.fn().mockName("once mock default"),
		prependListener = jest.fn().mockName("prependListener mock default"),
		prependOnceListener = jest.fn().mockName("prependOnceListener mock default"),
		removeListener = jest.fn().mockName("removeListener mock default"),
		// destroy - is handled/overridden as part of http.IncomingMessage

		/* event.EventEmitter */
		// addListener - is handled/overridden as part of stream.Readable
		// on - is handled/overridden as part of stream.Readable
		// once - is handled/overridden as part of stream.Readable
		// removeListener - is handled/overridden as part of stream.Readable
		off = jest.fn().mockName("off mock default"),
		removeAllListeners = jest.fn().mockName("removeAllListeners mock default"),
		setMaxListeners = jest.fn().mockName("setMaxListeners mock default"),
		getMaxListeners = jest.fn().mockName("getMaxListeners mock default"),
		listeners = jest.fn().mockName("listeners mock default"),
		rawListeners = jest.fn().mockName("rawListeners mock default"),
		// emit - is handled/overridden as part of stream.Readable
		listenerCount = jest.fn().mockName("listenerCount mock default"),
		// prependListener - is handled/overridden as part of stream.Readable
		// prependOnceListener - is handled/overridden as part of stream.Readable
		eventNames = jest.fn().mockName("eventNames mock default"),

		// custom values
		...extraProvidedValues
	} = values;

	const request = {
		/* express.Request */
		params,
		query,
		body,
		cookies,
		method,
		protocol,
		secure,
		ip,
		ips,
		subdomains,
		path,
		hostname,
		host,
		fresh,
		stale,
		xhr,
		route,
		signedCookies,
		originalUrl,
		url,
		baseUrl,
		accepted,
		get,
		header,
		accepts,
		acceptsCharsets,
		acceptsEncodings,
		acceptsLanguages,
		range,
		param,
		is,
		app,
		res,
		next,

		/* http.IncomingMessage */
		aborted,
		httpVersion,
		httpVersionMajor,
		httpVersionMinor,
		complete,
		connection,
		socket,
		headers,
		rawHeaders,
		trailers,
		rawTrailers,
		setTimeout,
		statusCode,
		statusMessage,
		destroy,

		/* stream.Readable */
		readable,
		readableHighWaterMark,
		readableLength,
		readableObjectMode,
		destroyed,
		_read,
		read,
		setEncoding,
		pause,
		resume,
		isPaused,
		unpipe,
		unshift,
		wrap,
		push,
		_destroy,
		addListener,
		emit,
		on,
		once,
		prependListener,
		prependOnceListener,
		removeListener,
		// destroy - is handled/overridden as part of http.IncomingMessage

		/* event.EventEmitter */
		// addListener - is handled/overridden as part of stream.Readable
		// on - is handled/overridden as part of stream.Readable
		// once - is handled/overridden as part of stream.Readable
		// removeListener - is handled/overridden as part of stream.Readable
		off,
		removeAllListeners,
		setMaxListeners,
		getMaxListeners,
		listeners,
		rawListeners,
		// emit - is handled/overridden as part of stream.Readable
		listenerCount,
		// prependListener - is handled/overridden as part of stream.Readable
		// prependOnceListener - is handled/overridden as part of stream.Readable
		eventNames,

		// custom values
		...extraProvidedValues,
	};

	return request as unknown as T;
};

// Local Types
export interface EventEventEmitter {
	addListener?: jest.Mock;
	on?: jest.Mock;
	once?: jest.Mock;
	removeListener?: jest.Mock;
	off?: jest.Mock;
	removeAllListeners?: jest.Mock;
	setMaxListeners?: jest.Mock;
	getMaxListeners?: jest.Mock;
	listeners?: jest.Mock;
	rawListeners?: jest.Mock;
	emit?: jest.Mock;
	listenerCount?: jest.Mock;
	prependListener?: jest.Mock;
	prependOnceListener?: jest.Mock;
	eventNames?: jest.Mock;
}

interface StreamReadable extends EventEventEmitter {
	readable?: Readable["readable"];
	readableHighWaterMark?: Readable["readableHighWaterMark"];
	readableLength?: Readable["readableLength"];
	readableObjectMode?: Readable["readableObjectMode"];
	destroyed?: Readable["destroyed"];
	_read?: jest.Mock;
	read?: jest.Mock;
	setEncoding?: jest.Mock;
	pause?: jest.Mock;
	resume?: jest.Mock;
	isPaused?: jest.Mock;
	unpipe?: jest.Mock;
	unshift?: jest.Mock;
	wrap?: jest.Mock;
	push?: jest.Mock;
	_destroy?: jest.Mock;
	addListener?: jest.Mock;
	emit?: jest.Mock;
	on?: jest.Mock;
	once?: jest.Mock;
	prependListener?: jest.Mock;
	prependOnceListener?: jest.Mock;
	removeListener?: jest.Mock;
	destroy?: jest.Mock;
}

interface HttpIncomingMessage extends StreamReadable {
	aborted?: IncomingMessage["aborted"];
	httpVersion?: IncomingMessage["httpVersion"];
	httpVersionMajor?: IncomingMessage["httpVersionMajor"];
	httpVersionMinor?: IncomingMessage["httpVersionMinor"];
	complete?: IncomingMessage["complete"];
	connection?: Partial<IncomingMessage["connection"]>;
	socket?: Partial<IncomingMessage["socket"]>;
	headers?: Partial<IncomingMessage["headers"]>;
	rawHeaders?: IncomingMessage["rawHeaders"];
	trailers?: IncomingMessage["trailers"];
	rawTrailers?: IncomingMessage["rawTrailers"];
	setTimeout?: jest.Mock;
	statusCode?: IncomingMessage["statusCode"];
	statusMessage?: IncomingMessage["statusMessage"];
	destroy?: jest.Mock;
}

export interface MockRequest extends HttpIncomingMessage {
	params?: Request["params"];
	query?: Request["query"];
	body?: Request["body"];
	cookies?: Request["cookies"];
	method?: Request["method"];
	protocol?: Request["protocol"];
	secure?: Request["secure"];
	ip?: Request["ip"];
	ips?: Request["ips"];
	subdomains?: Request["subdomains"];
	path?: Request["path"];
	hostname?: Request["hostname"];
	host?: Request["host"];
	fresh?: Request["fresh"];
	stale?: Request["stale"];
	xhr?: Request["xhr"];
	route?: Request["route"];
	signedCookies?: Request["signedCookies"];
	originalUrl?: Request["originalUrl"];
	url?: Request["url"];
	baseUrl?: Request["baseUrl"];
	accepted?: Request["accepted"];
	get?: jest.Mock;
	header?: jest.Mock;
	accepts?: jest.Mock;
	acceptsCharsets?: jest.Mock;
	acceptsEncodings?: jest.Mock;
	acceptsLanguages?: jest.Mock;
	range?: jest.Mock;
	param?: jest.Mock;
	is?: jest.Mock;
	app?: Partial<Request["app"]>;
	res?: Partial<Request["res"]>;
	next?: jest.Mock;

	// allow custom properties to be provided
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}
