class SummaryModel {
    constructor(summered_by, summary, date) {
        this._summered_by = summered_by;
        this._summary = summary;
        this._date = date;
    }

    // Getter for summered_by property
    get summered_by() {
        return this._summered_by;
    }

    // Setter for summered_by property
    set summered_by(summered_by) {
        this._summered_by = summered_by;
    }

    // Getter for summary property
    get summary() {
        return this._summary;
    }

    // Setter for summary property
    set summary(summary) {
        this._summary = summary;
    }

    // Getter for date property
    get date() {
        return this._date;
    }

    // Setter for date property
    set date(date) {
        this._date = date;
    }
}
