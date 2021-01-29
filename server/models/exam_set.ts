import { Model } from 'objection';

interface ExamSet {
  id: number;
  year: number;
  season: string;
  semesterId: number;
  reexam: 1 | 0;
  hadHelp: 1 | 0;
  name: string;
}

class ExamSet extends Model {
  static get tableName() {
    return 'semesterExamSet';
  }
}

export default ExamSet;
