import { get, isEmpty, isEqual, pickBy } from 'lodash';
import { getTextFromHtml } from 'utils';

const STATUS_KILLED = 'canceled';

/**
 * Get picture for an item
 *
 * if item is picture return it, otherwise look for featuremedia
 *
 * @param {Object} item
 * @return {Object}
 */
export function getPicture(item) {
    return item.type === 'picture' ? item : get(item, 'associations.featuremedia');
}

/**
 * Get picture thumbnail rendition specs
 *
 * @param {Object} picture
 * @return {Object}
 */
export function getThumbnailRendition(picture) {
    return get(picture, 'renditions.4-3', get(picture, 'renditions.thumbnail'));
}

/**
 * Get picture preview rendition
 *
 * @param {Object} picture
 * @return {Object}
 */
export function getPreviewRendition(picture) {
    return get(picture, 'renditions.4-3', get(picture, 'renditions.viewImage'));
}

/**
 * Get picture detail rendition
 *
 * @param {Object} picture
 * @return {Object}
 */
export function getDetailRendition(picture) {
    return get(picture, 'renditions.baseImage');
}

/**
 * Test if an item is killed
 *
 * @param {Object} item
 * @return {Boolean}
 */
export function isKilled(item) {
    return item.pubstatus === STATUS_KILLED;
}

/**
 * Test if other item versions should be visible
 *
 * @param {Object} item
 * @param {bool} next toggle if checking for next or previous versions
 * @return {Boolean}
 */
export function showItemVersions(item, next) {
    return !isKilled(item) && (next || item.ancestors && item.ancestors.length);
}

/**
 * Get short text for lists
 *
 * @param {Item} item
 * @return {Node}
 */
export function shortText(item, length=40) {
    const html = item.description_html || item.body_html || '<p></p>';
    const text = item.description_text || getTextFromHtml(html);
    const words = text.split(' ');
    return words.slice(0, length).join(' ') + (words.length > length ? '...' : '');
}

/**
 * Get caption for picture
 *
 * @param {Object} picture
 * @return {String}
 */
export function getCaption(picture) {
    return picture.body_text || picture.description_text;
}

export function getActiveQuery(query, activeFilter, createdFilter) {
    const queryParams = {
        query: query || null,
        filter: pickBy(activeFilter),
        created: pickBy(createdFilter),
    };

    return pickBy(queryParams, (val) => !isEmpty(val));
}

export function isTopicActive(topic, activeQuery) {
    const topicQuery = getActiveQuery(topic.query, topic.filter, topic.created);
    return !isEmpty(activeQuery) && isEqual(topicQuery, activeQuery);
}
