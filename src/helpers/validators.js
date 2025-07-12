/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
	allPass,
	anyPass,
	compose,
	count,
	equals,
	lte,
	not,
	prop,
	values,
} from 'ramda';

import { COLORS, SHAPES } from '../constants';

const getStar = prop(SHAPES.STAR);
const getSquare = prop(SHAPES.SQUARE);
const getTriangle = prop(SHAPES.TRIANGLE);
const getCircle = prop(SHAPES.CIRCLE);

const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
const isWhite = equals(COLORS.WHITE);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);

const isNotWhite = compose(not, isWhite);
const isNotRed = compose(not, isRed);

const isColorFigure = (isColor, getFigure) => compose(isColor, getFigure);
// const curriedIsColorFigure = partial(isColorFigure);

// посчитать сколько определенного цвета
const countColor = (colorPredict) => compose(count(colorPredict), values);
// больше или равно кол-во посчитанных фигур определенного цвета
const hasCountColor = (count, colorPredict) =>
	compose(lte(count), countColor(colorPredict));
// проверка на точное совпадение кол-ва цветов
const hasEqualCountColor = (count, colorPredict) =>
	compose(equals(count), countColor(colorPredict));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
	isColorFigure(isRed, getStar),
	isColorFigure(isGreen, getSquare),
	isColorFigure(isWhite, getTriangle),
	isColorFigure(isWhite, getCircle),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = hasCountColor(2, isGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (event) =>
	equals(countColor(isRed)(event), countColor(isBlue)(event));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
	isColorFigure(isBlue, getCircle),
	isColorFigure(isRed, getStar),
	isColorFigure(isOrange, getSquare),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () =>
	anyPass([
		hasCountColor(3, isRed),
		hasCountColor(3, isBlue),
		hasCountColor(3, isGreen),
		hasCountColor(3, isOrange),
	]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
	isColorFigure(isGreen, getTriangle),
	hasEqualCountColor(2, isGreen),
	hasEqualCountColor(1, isRed),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = hasEqualCountColor(4, isOrange);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
	allPass([isNotWhite, isNotRed]),
	getStar
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = () => hasEqualCountColor(4, isGreen);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
	(figures) => isNotWhite(getTriangle(figures)),
	(figures) => equals(getTriangle(figures), getSquare(figures)),
]);
