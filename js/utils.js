class Utils {
    static nameMap = new Map()
    static collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
    })

    static log(message) {
        console.log(
            `%c[A4GM]%c ${message} `,
            'color:white;background:#058D80',
            'font-weight:bold;color:#058D80;'
        )
    }

    static hashCode(s) {
        let nHash = 0
        if (!s.length) return nHash
        for (let i = 0, imax = s.length, n; i < imax; ++i) {
            n = s.charCodeAt(i)
            nHash = (nHash << 5) - nHash + n
            nHash = nHash & nHash // Convert to 32-bit integer
        }
        return Math.abs(nHash)
    }

    static minsPresent(timestamps) {
        let minsPresent = 0
        for (let i = 0; i < timestamps.length; i += 2) {
            const secs =
                i + 1 === timestamps.length
                    ? ~~(Date.now() / 1000) - timestamps[i]
                    : timestamps[i + 1] - timestamps[i]
            const mins = Math.round(secs / 6) / 10
            minsPresent += mins
        }
        return minsPresent
    }

    static dateTimeString(startTimestamp, timestamp) {
        const date = new Date(startTimestamp * 1000).toLocaleDateString()
        return `${date}, ${Utils.toTimeString(
            startTimestamp
        )} — ${Utils.toTimeString(timestamp)}`
    }

    static toTimeString(timestamp) {
        try {
            return new Date(timestamp * 1000).toLocaleTimeString([], {
                hour: 'numeric',
                minute: 'numeric',
            })
        } catch (e) {
            return new Date(timestamp * 1000).toLocaleTimeString()
        }
    }

    static getFirstName(fullName) {
        if (Utils.nameMap.has(fullName)) {
            return Utils.nameMap.get(fullName)[0]
        }
        return Utils.splitNames(fullName)[0]
    }

    static getLastName(fullName) {
        if (Utils.nameMap.has(fullName)) {
            return Utils.nameMap.get(fullName)[1]
        }
        return Utils.splitNames(fullName)[1]
    }

    static splitNames(fullName) {
        let splitNames
        if (fullName.includes('|')) {
            splitNames = fullName.split('|')
        } else if (fullName.includes(',')) {
            splitNames = fullName.split(/,(.+)/)
            splitNames = [splitNames[1].trim(), splitNames[0].trim()]
        } else {
            const names = fullName
                .split(' ')
                .filter(
                    (name) =>
                        !(
                            (name.charAt(0) === '[' &&
                                name.slice(-1) === ']') ||
                            (name.charAt(0) === '(' && name.slice(-1) === ')')
                        )
                )
            if (names.length === 1) {
                splitNames = [fullName, '']
            } else {
                let i = names.length - 1
                for (; i > 1; i--) {
                    const name = names[i]
                    if (name.charAt(0) === name.charAt(0).toLowerCase()) {
                        break
                    }
                }
                splitNames = [
                    names.slice(0, i).join(' '),
                    names.slice(i).join(' '),
                ]
            }
        }
        Utils.nameMap.set(fullName, splitNames)
        return splitNames
    }

    static compareFirst(a, b) {
        return Utils.collator.compare(
            Utils.getFirstName(a),
            Utils.getFirstName(b)
        )
    }

    static compareLast(a, b) {
        return Utils.collator.compare(Utils.getLastName(a), Utils.getLastName(b))
    }
}
