/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
	__,
	allPass,
	andThen,
	assoc,
	compose,
	concat,
	gt,
	ifElse,
	length,
	lt,
	mathMod,
	otherwise,
	partial,
	prop,
	tap,
	test,
} from 'ramda';
import Api from '../tools/api';

const API_NUMBERS_BASE_URL = 'https://api.tech/numbers/base';
const API_ANIMALS_URL = 'https://animals.tech/';

const api = new Api();

const lengthLowerThenTen = compose(lt(__, 10), length);
const lengthGreaterThenTwo = compose(gt(__, 2), length);
const onlyPositiveNumbers = test(/^[0-9]+(\.[0-9]+)?$/);

const validate = allPass([
	lengthLowerThenTen,
	lengthGreaterThenTwo,
	onlyPositiveNumbers,
]);

// Привести строку к числу, округлить к ближайшему целому с точностью до единицы,
const stringToNumber = compose(Math.round, Number);

// C помощью API /numbers/base перевести из 10-й системы счисления в двоичную
const getBinary = compose(
	api.get(API_NUMBERS_BASE_URL),
	assoc('number', __, { from: 10, to: 2 })
);

// Взять кол-во символов в полученном от API числе
const getLength = andThen(length);

// Возвести в квадрат с помощью Javascript
const getSquare = andThen((num) => num ** 2);

// Взять остаток от деления на 3
const getModForThree = andThen(compose(String, mathMod(__, 3)));

// C помощью API /animals.tech/id/name получить случайное животное
const getAnimals = andThen(compose(api.get(__, {}), concat(API_ANIMALS_URL)));

const getApiResult = compose(String, prop('result'));
const thenGetApiResult = andThen(getApiResult);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
	const tapLog = tap(writeLog);
	const thenTapLog = andThen(tapLog);

	// Завершить цепочку вызовом handleSuccess
	const thenHandleSuccess = andThen(handleSuccess);

	// В случае ошибки вызвать handleError с 'ValidationError'
	const otherwiseHandleError = otherwise(handleError);
	const handleValidationError = partial(handleError, ['ValidationError']);

	const doAndLog = (x) => compose(thenTapLog, x);

	const sequenceComposition = compose(
		otherwiseHandleError,
		thenHandleSuccess,
		thenGetApiResult,
		getAnimals,
		doAndLog(getModForThree),
		doAndLog(getSquare),
		doAndLog(getLength),
		thenTapLog,
		thenGetApiResult,
		getBinary,
		stringToNumber
	);

	compose(
		ifElse(validate, sequenceComposition, handleValidationError),
		tapLog
	)(value);
};

export default processSequence;
