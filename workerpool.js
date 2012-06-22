/** 
 * A job queue that will throttle itself to run the given amount of jobs at 
 * once. Also has a configurable maximum backlog size, at which point it will
 * start refusing to queue new jobs.
 *
 * Call enqueue to queue a job and jobFinished upon completion.
 */

function WorkerPool(max_concurrent, max_backlog) {
    this.queue = [];
    this.current = 0;
    this.max_concurrent = max_concurrent;
    this.max_backlog = max_backlog;
}

// Enqueue a function to run. Returns true if queued, false if it was not
// queued due to the backlog being full.
WorkerPool.prototype.enqueue = function(f) {
    if (this.queue.length < this.max_backlog) {
        this.queue.push(f);
        this.pump();
        return true;
    }
    else {
        return false;
    }
}

// This must be called when the job is finished to open up slots for 
// new jobs.
WorkerPool.prototype.jobFinished = function() {
    this.current -= 1;
    this.pump();
}

WorkerPool.prototype.pump = function() {
    while (this.queue.length > 0 && this.current < this.max_concurrent) {
        var next = this.queue.shift();
        this.current += 1;
        next();
    }
}

exports = module.exports = WorkerPool;
