import MusicEvent from './MusicEvent';
import Statistic from './Statistic';
import sequelize from '../config/database';

// Initialize associations if needed
// For now, models are independent

const models = {
     MusicEvent,
     Statistic,
     sequelize,
};

export default models;

