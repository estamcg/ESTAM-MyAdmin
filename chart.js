/>
    * Chart.js v4.5.1
        * https://www.chartjs.org
 * (c) 2025 Contributeurs de Chart.js
    * Publié sous licence MIT
        */
import { r as requestAnimFrame, a as resolve, e as effects, c as color, i as isObject, d as defaults, b as isArray, v as valueOrDefault, u as unlistenArrayEvents, l as listenArrayEvents, f as resolveObjectKey, g as isNumberFinite, h as defined, s as sign, j as createContext, k as isNullOrUndef, _ as _arrayUnique, t as toRadians, m as toPercentage, n as toDimension, T as TAU, o as formatNumber, p as _angleBetween, H as HALF_PI, P as PI, q as _getStartAndCountOfVisiblePoints, w as _scaleRangesChanged, x as isNumber, y as _parseObjectDataRadialScale, z as getRelativePosition, A as _rlookupByKey, B as _lookupByKey, C as _isPointInArea, D as getAngleFromPoint, E as toPadding, F as each, G as getMaximumSize, I as _getParentNode, J as readUsedSize, K as supportsEventListenerOptions, L as throttled, M as _isDomSupported, N as _factorize, O as finiteOrDefault, Q as callback, R as _addGrace, S as _limitValue, U as toDegrees, V as _measureText, W as _int16Range, X as _alignPixel, Y as clipArea, Z as renderText, $ as unclipArea, a0 as toFont, a1 as _toLeftRightCenter, a2 as _alignStartEnd, a3 as overrides, a4 as merge, a5 as _capitalize, a6 as descriptors, a7 as isFunction, a8 as _attachContext, a9 as _createResolver, aa as _descriptors, ab as mergeIf, ac as uid, ad as debounce, ae as retinaScale, af as clearCanvas, ag as setsEqual, ah as getDatasetClipArea, ai as _elementsEqual, aj as _isClickEvent, ak as _isBetween, al as _normalizeAngle, am as _readValueToProps, an as _updateBezierControlPoints, ao as _computeSegments, ap as _boundSegments, aq as _steppedInterpolation, ar as _bezierInterpolation, as as _pointInLine, at as _steppedLineTo, au as _bezierCurveTo, av as drawPoint, aw as addRoundedRectPath, ax as toTRBL, ay as toTRBLCorners, az as _boundSegment, aA as getRtlAdapter, aB as overrideTextDirection, aC as _textX, aD as restoreTextDirection, aE as drawPointLegend, aF as distanceBetweenPoints, aG as noop, aH as _setMinAndMaxByKey, aI as niceNum, aJ as almostWhole, aK as almostEquals, aL as _decimalPlaces, aM as Ticks, aN as log10, aO as _longestText, aP as _filterBetween, aQ as _lookup } from './chunks/helpers.dataset.js';
importer '@kurkle/color';

classe Animateur {
    constructeur(){
        this._request = null;
        this._charts = new Map();
        this._running = false;
        this._lastDate = indéfini;
    }
    _notify(graphique, animations, date, type) {
        const callbacks = anims.listeners[type];
        const numSteps = anims.duration;
        rappels.forEach((fn) => fn({
            graphique,
            initial: anims.initial,
            nombre d'étapes,
                currentStep: Math.min(date - anims.start, numSteps)
        }));
    }
    _refresh() {
        si(this._request) {
            retour;
        }
        ceci._running = vrai;
        this._request = requestAnimFrame.call(window, () => {
            this._update();
            this._request = null;
            si(this._running) {
                this._refresh();
            }
        });
    }
    _update(date = Date.now()) {
        soit restant = 0;
        this._charts.forEach((anims, chart) => {
            si(!anims.running || !anims.items.length) {
                retour;
            }
            const items = anims.items;
            soit i = items.length - 1;
            soit draw = faux;
            laisser l'élément;
            pour(; i >= 0; --i){
            élément = éléments[i];
            si(item._actif) {
                si(item._total > anims.duration) {
                    anims.duration = item._total;
                }
                élément.cocher(date);
                dessiner = vrai;
            } autre {
                articles[i] = articles[articles.longueur - 1];
                articles.pop();
            }
        }
        si(dessiner) {
            graphique.dessiner();
            this._notify(chart, anims, date, 'progress');
        }
        si(!items.length) {
            anims.running = false;
            this._notify(chart, anims, date, 'complete');
            anims.initial = faux;
        }
        restants += articles.longueur;
    });
    this._lastDate = date;
    si(restant === 0) {
        this._running = false;
    }
}
_getAnims(chart) {
    const charts = this._charts;
    let anims = charts.get(chart);
    si(!anims) {
        anims = {
            en cours d'exécution : faux,
                initial : vrai,
            articles: [],
            auditeurs: {
                complet: [],
                progrès: []
            }
        };
        graphiques.set(graphique, anims);
    }
        renvoyer les animations;
}
écouter(graphique, événement, cb) {
    this._getAnims(chart).listeners[event].push(cb);
}
ajouter(graphique, éléments) {
    si(!items || !items.length) {
        retour;
    }
    this._getAnims(chart).items.push(...items);
}
a(graphique) {
        retourner this._getAnims(chart).items.length > 0;
}
début(graphique) {
    const anims = this._charts.get(chart);
    si(!anims) {
        retour;
    }
    anims.running = vrai;
    anims.start = Date.now();
    anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
    this._refresh();
}
running(graphique) {
    si(!this._running) {
            renvoyer faux;
    }
    const anims = this._charts.get(chart);
    si(!anims || !anims.running || !anims.items.length) {
            renvoyer faux;
    }
        renvoyer vrai;
}
stop(graphique) {
    const anims = this._charts.get(chart);
    si(!anims || !anims.items.length) {
        retour;
    }
    const items = anims.items;
        soit i = items.length - 1;
    pour(; i >= 0; --i) {
        articles[i].annuler();
    }
    anims.items = [];
    this._notify(chart, anims, Date.now(), 'complete');
}
supprimer(graphique) {
        retourner this._charts.delete(chart);
}
}
var animator = /* #__PURE__ */ nouvel Animator();

const transparent = 'transparent';
interpolateurs constants = {
    booléen(de, à, facteur) {
        facteur de retour > 0, 5 ? à : de;
    },
    couleur(de, à, facteur) {
        const c0 = couleur(de || transparent);
        const c1 = c0.valid && color(to || transparent);
        retourner c1 && c1.valide ? c1.mix(c0, facteur).hexString() : à;
    },
    nombre(de, à, facteur) {
        retour de + (à - de) * facteur;
    }
};
classe Animation {
    constructeur(cfg, cible, prop, à){
        const valeur_actuelle = cible[prop];
        à = résoudre([
            cfg.to,
            à,
            valeur actuelle,
            cfg.from
        ]);
        const from = resolve([
            cfg.from,
            valeur actuelle,
            à
        ]);
        ceci._actif = vrai;
        this._fn = cfg.fn || interpolateurs[cfg.type || typeof from];
        this._easing = effets[cfg.easing] || effets.linear;
        this._start = Math.floor(Date.now() + (cfg.delay || 0));
        this._duration = this._total = Math.floor(cfg.duration);
        this._loop = !!cfg.loop;
        this._target = cible;
        this._prop = prop;
        this._from = from;
        ceci._à = à;
        this._promises = indéfini;
    }
    actif() {
        retourner this._active;
    }
    mettre à jour(cfg, à, date) {
        si(this._active) {
            this._notify(false);
            const currentValue = this._target[this._prop];
            const elapsed = date - this._start;
            const reste = this._duration - écoulé;
            this._start = date;
            this._duration = Math.floor(Math.max(remain, cfg.duration));
            this._total += écoulé;
            this._loop = !!cfg.loop;
            this._to = résoudre([
                cfg.to,
                à,
                valeur actuelle,
                cfg.from
            ]);
            this._from = resolve([
                cfg.from,
                valeur actuelle,
                à
            ]);
        }
    }
    Annuler() {
        si(this._active) {
            this.tick(Date.now());
            this._active = false;
            this._notify(false);
        }
    }
    cocher(date) {
        const elapsed = date - this._start;
        const durée = this._duration;
        const prop = this._prop;
        const from = this._from;
        const boucle = this._boucle;
        const to = this._to;
        laisser le facteur;
        this._active = from !== to && (loop || elapsed < duration);
        si(!this._active) {
            this._target[prop] = à;
            this._notify(true);
            retour;
        }
        si(temps écoulé < 0) {
            this._target[prop] = de;
            retour;
        }
        facteur = écoulé / durée % 2;
        facteur = boucle && facteur > 1 ? 2 - facteur : facteur;
        facteur = this._easing(Math.min(1, Math.max(0, facteur)));
        this._target[prop] = this._fn(from, to, factor);
    }
    attendez() {
        const promesses = this._promesses || (this._promesses = []);
        retourner une nouvelle promesse((res, rej) => {
            promesses.push({
                res,
                rej
            });
        });
    }
    _notifier(résolu) {
        const méthode = résolue ? 'res' : 'rej';
        const promesses = this._promesses || [];
        pour(soit i = 0 ; i < promises.length; i++) {
            promesses[i][méthode]();
        }
    }
}

classe Animations {
    constructeur(graphique, config){
        this._chart = graphique;
        this._properties = new Map();
        this.configure(config);
    }
    configurer(config) {
        si(!isObject(config)) {
            retour;
        }
        const animationOptions = Object.keys(defaults.animation);
        const animatedProps = this._properties;
        Object.getOwnPropertyNames(config).forEach((key) => {
            const cfg = config[clé];
            si(!isObject(cfg)) {
                retour;
            }
            const résolu = {};
            pour(const option de animationOptions){
            résolu[option] = cfg[option];
        }
        (isArray(cfg.properties) && cfg.properties || [
            clé
        ]).forEach((prop) => {
            si(prop === clé || !animatedProps.has(prop)) {
                animatedProps.set(prop, resolved);
            }
        });
    });
}
_animateOptions(cible, valeurs) {
    const newOptions = valeurs.options;
    const options = resolveTargetOptions(target, newOptions);
    si(!options) {
        retour[];
    }
    const animations = this._createAnimations(options, newOptions);
    si(newOptions.$shared) {
        awaitAll(target.options.$animations, newOptions).then(() => {
            cible.options = nouvellesOptions;
        }, () => {
        });
    }
        retour des animations;
}
_createAnimations(cible, valeurs) {
    const animatedProps = this._properties;
    const animations = [];
    const running = target.$animations || (target.$animations = {});
    const props = Object.keys(values);
    const date = Date.now();
    laissez - moi;
    pour(i = props.length - 1; i >= 0; --i) {
        const prop = props[i];
        si(prop.charAt(0) === '$') {
            continuer;
        }
        si(prop === 'options') {
            animations.push(...this._animateOptions(target, values));
            continuer;
        }
        const valeur = valeurs[prop];
            soit animation = running[prop];
        const cfg = animatedProps.get(prop);
        si(animation) {
            si(cfg && animation.active()) {
                animation.update(cfg, valeur, date);
                continuer;
            } autre {
                animation.annuler();
            }
        }
        si(!cfg || !cfg.duration) {
            cible[prop] = valeur;
            continuer;
        }
        running[prop] = animation = new Animation(cfg, target, prop, value);
        animations.push(animation);
    }
        retour des animations;
}
 mettre à jour(cible, valeurs) {
    si(this._properties.size === 0) {
        Objet.assigner(cible, valeurs);
        retour;
    }
    const animations = this._createAnimations(target, values);
    si(animations.length) {
        animateur.ajouter(this._chart, animations);
            renvoyer vrai;
    }
}
}
fonction awaitAll(animations, propriétés) {
    const running = [];
    const clés = Object.keys(propriétés);
    pour(soit i = 0 ; i < clés.length; i++) {
        const anim = animations[keys[i]];
        si(anim && anim.active()) {
            course.push(anim.wait());
        }
    }
    retourner Promise.all(running);
}
fonction resolveTargetOptions(cible, nouvellesOptions) {
    si(!newOptions) {
        retour;
    }
    let options = target.options;
    si(!options) {
        cible.options = nouvellesOptions;
        retour;
    }
    si(options.$shared) {
        cible.options = options = Object.assign({}, options, {
            $shared: false,
            $animations: {}
        });
    }
    options de retour;
}

fonction scaleClip(scale, allowedOverflow) {
    const opts = scale && scale.options || {};
    const reverse = opts.reverse;
    const min = opts.min === undefined ? allowedOverflow : 0;
    const max = opts.max === undefined ? allowedOverflow : 0;
    retour {
        début: inverser ? max : min,
            fin : inverser ? min : max
    };
}
fonction defaultClip(xScale, yScale, allowedOverflow) {
    si(allowedOverflow === false) {
        renvoyer faux;
    }
    const x = scaleClip(xScale, allowedOverflow);
    const y = scaleClip(yScale, allowedOverflow);
    retour {
        haut: y.end,
            droite : x.end,
                bas : y.début,
                    gauche : x.début
    };
}
fonction toClip(valeur) {
    soit t, r, b, l;
    si(isObject(value)) {
        t = valeur.haut;
        r = valeur.droite;
        b = valeur.bas;
        l = valeur.gauche;
    } autre {
        t = r = b = l = valeur;
    }
    retour {
        haut: t,
            droite : r,
                bas : b,
                    gauche : l,
                        désactivé : valeur === faux
    };
}
fonction getSortedDatasetIndices(chart, filterVisible) {
    const clés = [];
    const metasets = chart._getSortedDatasetMetas(filterVisible);
    laissez - moi, ilen;
    pour(i = 0, ilen = metasets.length; i < ilen; ++i) {
        clés.push(metasets[i].index);
    }
    clés de retour;
}
fonction applyStack(stack, valeur, dsIndex, options = {}) {
    const clés = pile.clés;
    const singleMode = options.mode === 'single';
    laissez - moi, ilen, datasetIndex, otherValue;
    si(valeur === null) {
        retour;
    }
    soit trouvé = faux;
    pour(i = 0, ilen = clés.longueur; i < ilen; ++i) {
        index_ensemble_de_données = +clés[i];
        si(datasetIndex === dsIndex) {
            trouvé = vrai;
            si(options.all) {
                continuer;
            }
            casser;
        }
        autreValeur = pile.valeurs[index_ensemble_de_données];
        si(isNumberFinite(otherValue) && (singleMode || value === 0 || sign(value) === sign(otherValue))) {
            valeur += autreValeur;
        }
    }
    si(!trouvé && !options.all) {
        renvoyer 0;
    }
    valeur de retour;
}
fonction convertObjectDataToArray(data, meta) {
    const { iScale, vScale } = meta;
    const iAxisKey = iScale.axis === 'x' ? 'x' : 'y';
    const vAxisKey = vScale.axis === 'x' ? 'x' : 'y';
    const clés = Object.clés(données);
    const adata = new Array(keys.length);
    laissez - moi, ilen, clé;
    pour(i = 0, ilen = clés.longueur; i < ilen; ++i) {
        clé = clés[i];
        adata[i] = {
            [iAxisKey]: clé,
            [vAxisKey]: données[clé]
        };
    }
    renvoyer adata;
}
fonction isStacked(échelle, méta) {
    const empilé = échelle && échelle.options.empilé;
    retourner empilé || empilé === undefined && meta.stack !== undefined;
}
fonction getStackKey(indexScale, valueScale, méta) {
    renvoie`${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}
fonction getUserBounds(échelle) {
    const { min, max, minDefined, maxDefined } = scale.getUserBounds();
    retour {
        min: minDéfini ? min : Nombre.NÉGATIF_INFINI,
            max : maxDéfini ? max : Nombre.POSITIVE_INFINITY
    };
}
fonction getOrCreateStack(stacks, stackKey, indexValue) {
    const subStack = stacks[stackKey] || (stacks[stackKey] = {});
    retourner subStack[indexValue] || (subStack[indexValue] = {});
}
fonction getLastIndexInStack(stack, vScale, positive, type) {
    pour(const meta de vScale.getMatchingVisibleMetas(type).reverse()) {
        valeur constante = pile[meta.index];
        si(positif && valeur > 0 || !positif && valeur < 0) {
            retourner meta.index;
        }
    }
    renvoyer null;
}
fonction updateStacks(contrôleur, analysé) {
    const { chart, _cachedMeta: meta } = contrôleur;
    const stacks = chart._stacks || (chart._stacks = {});
    const { iScale, vScale, index: datasetIndex } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const key = getStackKey(iScale, vScale, meta);
    const ilen = parsed.length;
    laisser la pile;
    pour(soit i = 0; i < ilen; ++i) {
        const item = parsed[i];
        const { [iAxis]: index, [vAxis]: valeur } = élément;
        const itemStacks = item._stacks || (item._stacks = {});
        pile = itemStacks[vAxis] = getOrCreateStack(stacks, clé, index);
        pile[index_ensemble_de_données] = valeur;
        pile._top = getLastIndexInStack(pile, vScale, true, meta.type);
        pile._bottom = getLastIndexInStack(pile, vScale, false, meta.type);
        const visualValues = stack._visualValues || (stack._visualValues = {});
        visualValues[datasetIndex] = valeur;
    }
}
fonction getFirstScaleId(graphique, axe) {
    const échelles = graphique.échelles;
    return Object.keys(scales).filter((key) => scales[key].axis === axis).shift();
}
fonction créerDatasetContext(parent, index) {
    retourner createContext(parent, {
    actif: faux,
    jeu de données: non défini,
    index du jeu de données: index,
    indice,
    mode: 'par défaut',
    type: 'ensemble de données'
});
}
fonction créerContexteDonnées(parent, index, élément) {
    retourner createContext(parent, {
    actif: faux,
    dataIndex: index,
    analysé: indéfini,
    brut: non défini,
    élément,
    indice,
    mode: 'par défaut',
    type: 'données'
});
}
fonction clearStacks(meta, items) {
    const datasetIndex = meta.controller.index;
    const axe = meta.vScale && meta.vScale.axe;
    si(!axe) {
        retour;
    }
    articles = articles || meta._parsed;
    pour(const analysé d'éléments){
    const piles = parsed._stacks;
    si(!stacks || stacks[axis] === undefined || stacks[axis][datasetIndex] === undefined) {
        retour;
    }
        supprimer stacks[axis][datasetIndex];
    si(stacks[axis]._visualValues !== undefined && stacks[axis]._visualValues[datasetIndex] !== undefined) {
            supprimer stacks[axis]._visualValues[datasetIndex];
    }
}
}
const isDirectUpdateMode = (mode) => mode === 'reset' || mode === 'none';
const cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
const createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked && {
    clés: getSortedDatasetIndices(chart, true),
    valeurs: nulles
};
classe DatasetController {
 valeurs par défaut statiques = {};
    type d'élément de jeu de données statique = null ;
    type d'élément de données statique = null ;
    constructeur(graphique, index_ensemble_de_données){
        this.chart = graphique;
        this._ctx = chart.ctx;
        this.index = datasetIndex;
        this._cachedDataOpts = {};
        this._cachedMeta = this.getMeta();
        this._type = this._cachedMeta.type;
        this.options = undefined;
        this._parsing = false;
        this._data = indéfini;
        this._objectData = non défini;
        this._sharedOptions = undefined;
        this._drawStart = indéfini;
        this._drawCount = indéfini;
        this.enableOptionSharing = false;
        this.supportsDecimation = false;
        this.$context = indéfini;
        this._syncList = [];
        this.datasetElementType = new.target.datasetElementType;
        this.dataElementType = new.target.dataElementType;
        this.initialize();
    }
    initialiser() {
        const meta = this._cachedMeta;
        this.configure();
        this.linkScales();
        meta._stacked = isStacked(meta.vScale, meta);
        this.addElements();
        si(this.options.fill && !this.chart.isPluginEnabled('filler')) {
            console.warn("Tentative d'utilisation de l'option 'fill' sans le plugin 'Filler' activé. Veuillez importer et enregistrer le plugin 'Filler' et assurez-vous qu'il n'est pas désactivé dans les options.");
        }
    }
    mettre à jourIndex(index de l'ensemble de données) {
        si(this.index !== datasetIndex) {
        effacerStacks(this._cachedMeta);
}
this.index = datasetIndex;
    }
linkScales() {
    const graphique = this.graphique;
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    const chooseId = (axis, x, y, r) => axis === 'x' ? x : axis === 'r' ? r : y;
    const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, 'x'));
    const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, 'y'));
    const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, 'r'));
    const indexAxis = meta.indexAxis;
    const iid = méta.iAxisID = ChooseId(indexAxis, xid, yid, rid);
    const vid = méta.vAxisID = ChooseId(indexAxis, yid, xid, rid);
    meta.xScale = this.getScaleForId(xid);
    meta.yScale = this.getScaleForId(yid);
    meta.rScale = this.getScaleForId(rid);
    meta.iScale = this.getScaleForId(iid);
    meta.vScale = this.getScaleForId(vid);
}
obtenirDataset() {
        renvoie this.chart.data.datasets[this.index];
}
getMeta() {
        retourner this.chart.getDatasetMeta(this.index);
}
obtenirScaleForId(scaleID) {
        renvoyer this.chart.scales[scaleID];
}
_getOtherScale(scale) {
    const meta = this._cachedMeta;
        retourner scale === meta.iScale ? meta.vScale : meta.iScale;
}
réinitialiser() {
    this._update('reset');
}
_détruire() {
    const meta = this._cachedMeta;
    si(this._data) {
        unlistenArrayEvents(this._data, this);
    }
    si(meta._stacked) {
        effacerPiles(méta);
    }
}
_dataCheck() {
    const dataset = this.getDataset();
    const data = dataset.data || (dataset.data = []);
    const _data = this._data;
    si(isObject(data)) {
        const meta = this._cachedMeta;
        this._data = convertObjectDataToArray(data, meta);
    } sinon si(_data !== data) {
        si(_données) {
            unlistenArrayEvents(_data, this);
            const meta = this._cachedMeta;
            effacerPiles(méta);
            meta._parsed = [];
        }
        si(données && Object.isExtensible(données)) {
            écouterArrayEvents(données, ceci);
        }
        this._syncList = [];
        this._data = données;
    }
}
ajouterÉléments() {
    const meta = this._cachedMeta;
    this._dataCheck();
    si(this.datasetElementType) {
        meta.dataset = new this.datasetElementType();
    }
}
construireOuMettreÀJourÉléments(réinitialiserNouveauxÉléments) {
    const meta = this._cachedMeta;
    const dataset = this.getDataset();
    let stackChanged = false;
    this._dataCheck();
    const oldStacked = meta._stacked;
    meta._stacked = isStacked(meta.vScale, meta);
    si(meta.stack !== dataset.stack) {
        pileChanged = vrai;
        effacerPiles(méta);
        meta.stack = dataset.stack;
    }
    this._resyncElements(resetNewElements);
    si(stackChanged || oldStacked !== meta._stacked) {
            mettre à jour les piles(ceci, meta._parsed);
        meta._stacked = isStacked(meta.vScale, meta);
    }
}
configurer() {
    const config = this.chart.config;
    const scopeKeys = config.datasetScopeKeys(this._type);
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
    this.options = config.createResolver(scopes, this.getContext());
    this._parsing = this.options.parsing;
    this._cachedDataOpts = {};
}
analyser(début, nombre) {
    const { _cachedMeta: meta, _data: data } = this;
    const { iScale, _stacked } = meta;
    const iAxis = iScale.axis;
        soit sorted = start === 0 && count === data.length ? true : meta._sorted;
        soit prev = start > 0 && meta._parsed[start - 1];
        soit i, cur, analysé;
    si(this._parsing === false) {
        meta._parsed = données;
        meta._sorted = vrai;
        analysés = données;
    } autre {
        si(isArray(data[start])) {
            analysé = this.parseArrayData(meta, data, start, count);
        } sinon si(isObject(data[start])) {
            analysé = this.parseObjectData(meta, data, start, count);
        } autre {
            analysé = this.parsePrimitiveData(meta, data, start, count);
        }
        const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];
        pour(i = 0; i < count; ++i) {
            meta._parsed[i + start] = cur = parsed[i];
            si(trié) {
                si(isNotInOrderComparedToPrev()) {
                    trié = faux;
                }
                précédent = actuel;
            }
        }
        meta._sorted = trié;
    }
    si(_empilé) {
            mettre à jour les piles(ceci, analysé);
    }
}
analyserDonnéesPrimitives(méta, données, début, nombre) {
    const { iScale, vScale } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const analysé = nouveau tableau(compteur);
        soit i, ilen, index;
    pour(i = 0, ilen = count; i < ilen; ++i) {
        index = i + début;
        analysé[i] = {
            [iAxis]: singleScale || iScale.parse(labels[index], index),
            [vAxis]: vScale.parse(data[index], index)
        };
    }
        retour analysé;
}
analyserArrayData(méta, données, début, nombre) {
    const { xScale, yScale } = meta;
    const analysé = nouveau tableau(compteur);
        soit i, ilen, index, élément;
    pour(i = 0, ilen = count; i < ilen; ++i) {
        index = i + début;
        élément = données[index];
        analysé[i] = {
            x: xScale.parse(item[0], index),
            y: yScale.parse(item[1], index)
        };
    }
        retour analysé;
}
analyserObjectData(méta, données, début, nombre) {
    const { xScale, yScale } = meta;
    const { xAxisKey = 'x', yAxisKey = 'y' } = this._parsing;
    const analysé = nouveau tableau(compteur);
        soit i, ilen, index, élément;
    pour(i = 0, ilen = count; i < ilen; ++i) {
        index = i + début;
        élément = données[index];
        analysé[i] = {
            x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
            y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
        };
    }
        retour analysé;
}
obtenirParsed(index) {
        retourner this._cachedMeta._parsed[index];
}
obtenirDataElement(index) {
        retourner this._cachedMeta.data[index];
}
appliquerPile(échelle, analysé, mode) {
    const graphique = this.graphique;
    const meta = this._cachedMeta;
        valeur constante = analysé[échelle.axe];
    const stack = {
        clés: getSortedDatasetIndices(chart, true),
        valeurs: parsed._stacks[scale.axis]._visualValues
    };
        retourner applyStack(stack, valeur, meta.index, {
        mode
    });
}
 mettre à jourPlageÀPartirAnalysé(plage, échelle, analysé, pile) {
    const valeurAnalysée = analysée[échelle.axe];
        soit valeur = valeuranalysée === null ? NaN : valeuranalysée;
        valeurs const = pile && analysées._piles[échelle.axe];
    si(pile && valeurs) {
        pile.valeurs = valeurs;
        valeur = applyStack(stack, parsedValue, this._cachedMeta.index);
    }
    plage.min = Math.min(plage.min, valeur);
    plage.max = Math.max(plage.max, valeur);
}
obtenirMinMax(échelle, peutEmpiler) {
    const meta = this._cachedMeta;
    const _parsed = meta._parsed;
    const sorted = meta._sorted && scale === meta.iScale;
    const ilen = _parsed.length;
    const autreÉchelle = this._getAutreÉchelle(échelle);
    const pile = créerPile(peutPile, méta, this.chart);
    const range = {
        min: Nombre.POSITIVE_INFINITY,
        max: Nombre.NÉGATIVE_INFINITY
    };
    const { min: otherMin, max: otherMax } = getUserBounds(otherScale);
        soit i, analysé;
        fonction _skip() {
        analysé = _analysé[i];
        const autreValeur = analysé[autreÉchelle.axe];
        return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
    }
    pour(i = 0; i < ilen; ++i) {
        si(_skip()) {
            continuer;
        }
        this.updateRangeFromParsed(range, scale, parsed, stack);
        si(trié) {
            casser;
        }
    }
    si(trié) {
        pour(i = ilen - 1; i >= 0; --i) {
            si(_skip()) {
                continuer;
            }
            this.updateRangeFromParsed(range, scale, parsed, stack);
            casser;
        }
    }
        plage de retour;
}
obtenirToutesLesValeursAnalysées(échelle) {
    const parsed = this._cachedMeta._parsed;
        valeurs constantes = [];
        soit i, ilen, valeur;
    pour(i = 0, ilen = longueur analysée; i < ilen; ++i) {
        valeur = analysé[i][échelle.axe];
        si(estNombreFin(valeur)) {
            valeurs.push(valeur);
        }
    }
        valeurs de retour;
}
obtenirMaxOverflow() {
        renvoyer faux;
}
obtenirLabelEtValeur(index) {
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const parsed = this.getParsed(index);
        retour {
        étiquette: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
            valeur : vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
    };
}
_update(mode) {
    const meta = this._cachedMeta;
    this.update(mode || 'default');
    meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
}
 mettre à jour(mode) { }
dessiner() {
    const ctx = this._ctx;
    const graphique = this.graphique;
    const meta = this._cachedMeta;
    const éléments = meta.data || [];
    const area = chart.chartArea;
    const actif = [];
    const start = this._drawStart || 0;
    const count = this._drawCount || elements.length - start;
    const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
    laissez - moi;
    si(meta.dataset) {
        meta.dataset.draw(ctx, area, start, count);
    }
    pour(i = début; i < début + compteur; ++i) {
        const élément = éléments[i];
        si(élément.caché) {
            continuer;
        }
        si(élément.actif && dessinerLesÉlémentsActifsEnHaut) {
            actif.push(élément);
        } autre {
            élément.dessiner(ctx, zone);
        }
    }
    pour(i = 0; i < active.length; ++i) {
        actif[i].dessiner(ctx, zone);
    }
}
obtenirStyle(index, actif) {
    const mode = actif ? 'actif' : 'par défaut';
    return index === undefined && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
}
obtenirContexte(index, actif, mode) {
    const dataset = this.getDataset();
        laissez le contexte;
    si(index >= 0 && index < this._cachedMeta.data.length) {
        const élément = this._cachedMeta.data[index];
        contexte = élément.$contexte || (élément.$contexte = créerContexteDonnées(this.getContext(), index, élément));
        contexte.analysé = this.getParsed(index);
        contexte.raw = dataset.data[index];
        contexte.index = contexte.dataIndex = index;
    } autre {
        contexte = this.$contexte || (this.$contexte = créerContexteEnsembleDeDonnées(this.chart.getContext(), this.index));
        contexte.dataset = dataset;
        contexte.index = contexte.datasetIndex = this.index;
    }
    contexte.actif = !!actif;
    contexte.mode = mode;
        renvoyer le contexte;
}
resolveDatasetElementOptions(mode) {
        retourner this._resolveElementOptions(this.datasetElementType.id, mode);
}
resolveDataElementOptions(index, mode) {
        retourner this._resolveElementOptions(this.dataElementType.id, mode, index);
}
_resolveElementOptions(elementType, mode = 'default', index) {
    const actif = mode === 'actif';
    const cache = this._cachedDataOpts;
    const cacheKey = elementType + '-' + mode;
    const cached = cache[cacheKey];
    const sharing = this.enableOptionSharing && defined(index);
    si(en cache) {
            retourner cloneIfNotShared(caché, partage);
    }
    const config = this.chart.config;
    const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
    const préfixes = actif ? [
        `${elementType}Hover`,
        'flotter',
        type d'élément,
            ''
    ] : [
        type d'élément,
            ''
    ];
    const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
    const noms = Object.keys(defaults.elements[elementType]);
    const contexte = () => this.getContext(index, active, mode);
    const valeurs = config.resolveNamedOptions(scopes, noms, contexte, préfixes);
    si(valeurs.$shared) {
        valeurs.$partagé = partage;
        cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
    }
        valeurs de retour;
}
_resolveAnimations(index, transition, active) {
    const graphique = this.graphique;
    const cache = this._cachedDataOpts;
    const cacheKey = `animation-${transition}`;
    const cached = cache[cacheKey];
    si(en cache) {
            renvoyer en cache;
    }
        laissez les options;
    si(chart.options.animation !== false) {
        const config = this.chart.config;
        const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
        options = config.createResolver(scopes, this.getContext(index, active, transition));
    }
    const animations = new Animations(chart, options && options.animations);
    si(options && options._cacheable) {
        cache[cacheKey] = Object.freeze(animations);
    }
        retour des animations;
}
obtenirOptionsPartagées(options) {
    si(!options.$shared) {
        retour;
    }
        retourner this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
}
inclureOptions(mode, optionspartagées) {
    retourner!sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
}
_getSharedOptions(start, mode) {
    const firstOpts = this.resolveDataElementOptions(start, mode);
    const previouslySharedOptions = this._sharedOptions;
    const sharedOptions = this.getSharedOptions(firstOpts);
    const includeOptions = this.includeOptions(mode, sharedOptions) || sharedOptions !== previouslySharedOptions;
    this.updateSharedOptions(sharedOptions, mode, firstOpts);
        retour {
            options partagées,
            inclure les options
    };
}
 mettre à jourElement(élément, index, propriétés, mode) {
    si(isDirectUpdateMode(mode)) {
        Objet.assigner(élément, propriétés);
    } autre {
        this._resolveAnimations(index, mode).update(element, properties);
    }
}
 mettre à jour les options partagées(options partagées, mode, nouvelles options) {
    si(sharedOptions && !isDirectUpdateMode(mode)) {
        this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
    }
}
_setStyle(élément, index, mode, actif) {
    élément.actif = actif;
    const options = this.getStyle(index, active);
    this._resolveAnimations(index, mode, active).update(element, {
        options: !active && this.getSharedOptions(options) || options
    });
}
supprimerHoverStyle(élément, datasetIndex, index) {
    this._setStyle(élément, index, 'active', false);
}
définirStyleSurvol(élément, indexEnsembleDeDonnées, index) {
    this._setStyle(élément, index, 'active', true);
}
_removeDatasetHoverStyle() {
    const élément = this._cachedMeta.dataset;
    si(élément) {
        this._setStyle(élément, undefined, 'active', false);
    }
}
_setDatasetHoverStyle() {
    const élément = this._cachedMeta.dataset;
    si(élément) {
        this._setStyle(élément, undefined, 'active', true);
    }
}
_resyncElements(resetNewElements) {
    const data = this._data;
    const éléments = this._cachedMeta.data;
    pour(const [méthode, arg1, arg2] de this._syncList) {
        cette[méthode](arg1, arg2);
    }
    this._syncList = [];
    const numMeta = elements.length;
    const numData = data.length;
    const count = Math.min(numData, numMeta);
    si(compte) {
        this.parse(0, count);
    }
    si(numData > numMeta) {
        this._insertElements(numMeta, numData - numMeta, resetNewElements);
    } sinon si(numData < numMeta) {
        this._removeElements(numData, numMeta - numData);
    }
}
_insertElements(start, count, resetNewElements = true) {
    const meta = this._cachedMeta;
    const data = meta.data;
    const end = start + count;
    laissez - moi;
    const move = (arr) => {
        arr.length += count;
        pour(i = arr.length - 1; i >= end; i--) {
            arr[i] = arr[i - count];
        }
    };
    déplacer(données);
    pour(i = début; i < fin; ++i) {
        data[i] = new this.dataElementType();
    }
    si(this._parsing) {
        déplacer(méta._analysé);
    }
    this.parse(start, count);
    si(resetNewElements) {
        this.updateElements(data, start, count, 'reset');
    }
}
    mettre à jourElements(élément, début, nombre, mode) { }
_supprimerÉléments(début, nombre) {
    const meta = this._cachedMeta;
    si(this._parsing) {
        const removed = meta._parsed.splice(start, count);
        si(meta._stacked) {
            effacerPiles(méta, supprimé);
        }
    }
    meta.data.splice(début, nombre);
}
_sync(args) {
    si(this._parsing) {
        this._syncList.push(args);
    } autre {
        const [méthode, arg1, arg2] = args;
        cette[méthode](arg1, arg2);
    }
    this.chart._dataChanges.push([
        ceci.index,
        ...args
    ]);
}
_onDataPush() {
    const count = arguments.length;
    this._sync([
        '_insertElements',
        this.getDataset().data.length - count,
        compter
    ]);
}
_onDataPop() {
    this._sync([
        '_supprimerÉléments',
        this._cachedMeta.data.length - 1,
        1
    ]);
}
_onDataShift() {
    this._sync([
        '_supprimerÉléments',
        0,
        1
    ]);
}
_onDataSplice(début, nombre) {
    si(compte) {
        this._sync([
            '_supprimerÉléments',
            commencer,
            compter
        ]);
    }
    const newCount = arguments.length - 2;
    si(nouveauCompteur) {
        this._sync([
            '_insertElements',
            commencer,
            nouveauCompte
        ]);
    }
}
_onDataUnshift() {
    this._sync([
        '_insertElements',
        0,
        arguments.longueur
    ]);
}
}

fonction getAllScaleValues(échelle, type) {
    si(!scale._cache.$bar) {
        const visibleMetas = scale.getMatchingVisibleMetas(type);
        soit valeurs = [];
        pour(soit i = 0, ilen = visibleMetas.length; i < ilen; i++) {
            valeurs = valeurs.concat(visibleMetas[i].controller.getAllParsedValues(scale));
        }
        scale._cache.$bar = _arrayUnique(values.sort((a, b) => a - b));
    }
    retourner scale._cache.$bar;
}
 fonction calculerMinSampleSize(meta) {
    const scale = meta.iScale;
    const valeurs = obtenirToutesLesValeursD'Échelle(échelle, meta.type);
    soit min = échelle._longueur;
    laissez i, ilen, curr, prev;
    const updateMinAndPrev = () => {
        si(curr === 32767 || curr === -32768) {
            retour;
        }
        si(défini(précédent)) {
            min = Math.min(min, Math.abs(curr - prev) || min);
        }
        précédent = actuel;
    };
    pour(i = 0, ilen = valeurs.length; i < ilen; ++i) {
        curr = scale.getPixelForValue(values[i]);
        mettre à jourMinAndPrev();
    }
    précédent = non défini;
    pour(i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
        curr = scale.getPixelForTick(i);
        mettre à jourMinAndPrev();
    }
    renvoyer min;
}
 fonction computeFitCategoryTraits(index, rule, options, stackCount) {
    const épaisseur = options.barThickness;
    soit la taille, le rapport;
    si(estNullOuIndéfini(épaisseur)) {
        taille = règle.min * options.catégoriePourcentage;
        rapport = options.barPercentage;
    } autre {
        taille = épaisseur * nombre de piles;
        ratio = 1;
    }
    retour {
        morceau: taille / nombre de piles,
            rapport,
            début : rule.pixels[index] - taille / 2
    };
}
 fonction calculerFlexCategoryTraits(index, règle, options, nombreempilement) {
    const pixels = règle.pixels;
    const curr = pixels[index];
    soit prev = index > 0 ? pixels[index - 1] : null;
    soit suivant = index < pixels.length - 1 ? pixels[index + 1] : null;
    const percent = options.categoryPercentage;
    si(précédent === nul) {
        précédent = actuel - (suivant === null ? règle.fin - règle.début : suivant - actuel);
    }
    si(suivant === null) {
        suivant = actuel + actuel - précédent;
    }
    const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
    const taille = Math.abs(suivant - précédent) / 2 * pourcentage;
    retour {
        morceau: taille / nombre de piles,
            ratio : options.barPercentage,
                commencer
    };
}
fonction parseFloatBar(entrée, élément, vScale, i) {
    const startValue = vScale.parse(entry[0], i);
    const endValue = vScale.parse(entry[1], i);
    const min = Math.min(startValue, endValue);
    const max = Math.max(startValue, endValue);
    soit barStart = min;
    soit barEnd = max;
    si(Math.abs(min) > Math.abs(max)) {
        barreStart = max;
        barreEnd = min;
    }
    élément[vScale.axis] = barEnd;
    article._personnalisé = {
        barStart,
        barEnd,
        début: valeur de départ,
        fin: endValue,
        min,
        max
    };
}
fonction parseValue(entrée, élément, vScale, i) {
    si(isArray(entrée)) {
        parseFloatBar(entrée, élément, vScale, i);
    } autre {
        élément[vScale.axis] = vScale.parse(entrée, i);
    }
    retourner l'article ;
}
fonction parseArrayOrPrimitive(meta, data, start, count) {
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const analysé = [];
    soit i, ilen, élément, entrée;
    for (i = début, ilen = début + count; i < ilen; ++i) {
        entrée = données[i];
        élément = {};
        item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
        parsed.push(parseValue(entry, item, vScale, i));
    }
    retour analysé;
}
fonction isFloatBar(personnalisé) {
    retourner personnalisé && personnalisé.barStart !== undefined && personnalisé.barEnd !== undefined;
}
fonction barreSign(taille, vScale, baseActuelle) {
    si(taille !== 0) {
        retour signe(taille);
    }
    retourner(vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
}
fonction borderProps(propriétés) {
    laisser inverser, début, fin, haut, bas;
    si(propriétés.horizontal) {
        inverse = propriétés.base > propriétés.x;
        départ = 'gauche';
        fin = 'droite';
    } autre {
        inverse = propriétés.base < propriétés.y;
        début = 'bas';
        fin = 'haut';
    }
    si(inverse) {
        haut = 'fin';
        bas = 'début';
    } autre {
        haut = 'début';
        bas = 'fin';
    }
    retour {
        commencer,
            fin,
            inverse,
            haut,
            bas
    };
}
fonction setBorderSkipped(propriétés, options, pile, index) {
    soit edge = options.borderSkipped;
    const res = {};
    si(!bord) {
        propriétés.borderSkipped = res;
        retour;
    }
    si(bord === vrai) {
        propriétés.borderSkipped = {
            haut: vrai,
            droit: vrai,
            bas: vrai,
            gauche: vrai
        };
        retour;
    }
    const { début, fin, inverse, haut, bas } = borderProps(propriétés);
    si(bord === 'milieu' && pile) {
        propriétés.activerRayonBordure = vrai;
        si((stack._top || 0) === index) {
            bord = haut;
        } sinon si((stack._bottom || 0) === index) {
            bord = bas;
        } autre {
            res[parseEdge(bottom, start, end, reverse)] = true;
            bord = haut;
        }
    }
    res[parseEdge(edge, start, end, reverse)] = true;
    propriétés.borderSkipped = res;
}
fonction parseEdge(edge, a, b, reverse) {
    si(inverse) {
        bord = échanger(bord, a, b);
        bord = débutFin(bord, b, a);
    } autre {
        bord = débutFin(bord, a, b);
    }
    bord de retour;
}
fonction swap(orig, v1, v2) {
    retourner orig === v1 ? v2 : orig === v2 ? v1 : orig;
}
function startEnd(v, début, fin) {
    retourner v === 'start' ? start : v === 'end' ? end : v;
}
fonction setInflateAmount(propriétés, { inflateAmount }, ratio) {
    propriétés.inflateAmount = inflateAmount === 'auto' ? ratio === 1 ? 0.33 : 0 : inflateAmount;
}
classe BarController étend DatasetController {
    id statique = 'bar';
 valeurs par défaut statiques = {
        datasetElementType: false,
        dataElementType: 'bar',
        Pourcentage par catégorie: 0, 8,
        barPercentage: 0, 9,
        groupé: vrai,
        animations: {
            nombres: {
                type: 'nombre',
                propriétés: [
                    'x',
                    'y',
                    'base',
                    'largeur',
                    'hauteur'
                ]
            }
        }
    };
 remplacements statiques = {
        échelles: {
            _index_: {
                type: 'catégorie',
                décalage: vrai,
                grille: {
                    décalage: vrai
                }
            },
            _valeur_: {
                type: 'linéaire',
                débutÀZéro: vrai
            }
        }
    };
    analyserDonnéesPrimitives(méta, données, début, nombre) {
        renvoie parseArrayOrPrimitive(meta, data, start, count);
    }
    analyserArrayData(méta, données, début, nombre) {
        renvoie parseArrayOrPrimitive(meta, data, start, count);
    }
    analyserObjectData(méta, données, début, nombre) {
        const { iScale, vScale } = meta;
        const { xAxisKey = 'x', yAxisKey = 'y' } = this._parsing;
        const iAxisKey = iScale.axis === 'x' ? xAxisKey : yAxisKey;
        const vAxisKey = vScale.axis === 'x' ? xAxisKey : yAxisKey;
        const analysé = [];
        soit i, ilen, item, obj;
        for (i = début, ilen = début + count; i < ilen; ++i) {
            obj = données[i];
            élément = {};
            item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i);
            parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i));
        }
        retour analysé;
    }
 mettre à jourPlageÀPartirAnalysé(plage, échelle, analysé, pile) {
        super.updateRangeFromParsed(range, scale, parsed, stack);
        const personnalisé = analysé._personnalisé;
        si(personnalisé && échelle === this._cachedMeta.vScale) {
            plage.min = Math.min(plage.min, personnalisé.min);
            plage.max = Math.max(plage.max, custom.max);
        }
    }
    obtenirMaxOverflow() {
        renvoyer 0;
    }
    obtenirLabelEtValeur(index) {
        const meta = this._cachedMeta;
        const { iScale, vScale } = meta;
        const parsed = this.getParsed(index);
        const personnalisé = analysé._personnalisé;
        const valeur = isFloatBar(custom) ? '[' + custom.start + ', ' + custom.end + ']' : '' + vScale.getLabelForValue(parsed[vScale.axis]);
        retour {
            étiquette: '' + iScale.getLabelForValue(parsed[iScale.axis]),
                valeur
        };
    }
    initialiser() {
        this.enableOptionSharing = true;
        super.initialiser();
        const meta = this._cachedMeta;
        meta.stack = this.getDataset().stack;
    }
    mettre à jour(mode) {
        const meta = this._cachedMeta;
        this.updateElements(meta.data, 0, meta.data.length, mode);
    }
    mettre à jourElements(barres, début, nombre, mode) {
        const reset = mode === 'reset';
        const { index, _cachedMeta: { vScale } } = this;
        const base = vScale.getBasePixel();
        const horizontal = vScale.isHorizontal();
        const rule = this._getRuler();
        const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
        pour(soit i = début; i < début + compteur; i++) {
            const parsed = this.getParsed(i);
            const vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? {
                base,
                tête: base
            } : this._calculateBarValuePixels(i);
            const ipixels = this._calculateBarIndexPixels(i, rule);
            const stack = (parsed._stacks || {})[vScale.axis];
            propriétés constantes = {
                horizontal,
                base: vpixels.base,
                activerBorderRadius: !stack || isFloatBar(parsed._custom) || index === stack._top || index === stack._bottom,
                x: horizontal ? vpixels.head : ipixels.center,
                y: horizontal ? ipixels.center : vpixels.head,
                hauteur: horizontale ? ipixels.size : Math.abs(vpixels.size),
                largeur: horizontale ? Math.abs(vpixels.size) : ipixels.size
            };
            si(includeOptions) {
                propriétés.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? 'active' : mode);
            }
            const options = propriétés.options || bars[i].options;
            définirBorderSkipped(propriétés, options, pile, index);
            définirInflateAmount(propriétés, options, règle.ratio);
            this.updateElement(bars[i], i, propriétés, mode);
        }
    }
    _getStacks(last, dataIndex) {
        const { iScale } = this._cachedMeta;
        const metasets = iScale.getMatchingVisibleMetas(this._type).filter((meta) => meta.controller.options.grouped);
        const empilé = iScale.options.empilé;
        const piles = [];
        const currentParsed = this._cachedMeta.controller.getParsed(dataIndex);
        const iScaleValue = currentParsed && currentParsed[iScale.axis];
        const skipNull = (meta) => {
            const parsed = meta._parsed.find((item) => item[iScale.axis] === iScaleValue);
            const val = parsed && parsed[meta.vScale.axis];
            si(isNullOrUndef(val) || isNaN(val)) {
                renvoyer vrai;
            }
        };
        pour(const meta de metasets) {
            si (dataIndex !== undefined && skipNull(meta)) {
            continuer;
        }
        si(stacked === false || stacks.indexOf(meta.stack) === -1 || stacked === undefined && meta.stack === undefined) {
            piles.push(meta.stack);
        }
        si(meta.index === dernier) {
            casser;
        }
    }
    si(!stacks.length) {
        piles.push(undefined);
    }
        renvoyer les piles;
}
_getStackCount(index) {
        renvoie this._getStacks(undefined, index).length;
}
_getAxisCount() {
        retourner this._getAxis().length;
}
getFirstScaleIdForIndexAxis() {
    const scales = this.chart.scales;
    const indexScaleId = this.chart.options.indexAxis;
    return Object.keys(scales).filter((key) => scales[key].axis === indexScaleId).shift();
}
_getAxis() {
    const axe = {};
    const firstScaleAxisId = this.getFirstScaleIdForIndexAxis();
    pour(const dataset de this.chart.data.datasets) {
        axe[valeurOuParDéfaut(this.chart.options.indexAxis === 'x' ? dataset.xAxisID : dataset.yAxisID, firstScaleAxisId)] = true;
    }
        retourner Object.keys(axis);
}
_getStackIndex(datasetIndex, nom, dataIndex) {
    const stacks = this._getStacks(datasetIndex, dataIndex);
    const index = nom !== undefined ? stacks.indexOf(nom) : -1;
        retourner index === -1 ? stacks.length - 1 : index;
}
_getRuler() {
    const opts = this.options;
    const meta = this._cachedMeta;
    const iScale = meta.iScale;
    const pixels = [];
    laissez - moi, ilen;
    pour(i = 0, ilen = meta.data.length; i < ilen; ++i) {
        pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
    }
    const barThickness = opts.barThickness;
    const min = barThickness || computeMinSampleSize(meta);
        retour {
        min,
            pixels,
            début : iScale._startPixel,
                fin : iScale._endPixel,
                    stackCount : this._getStackCount(),
                        échelle : iScale,
                            groupé : opts.groupé,
                                ratio : épaisseur de la barre ? 1 : opts.categoryPercentage * opts.barPercentage
    };
}
_calculerBarValuePixels(index) {
    const { _cachedMeta: { vScale, _stacked, index: datasetIndex }, options: { base: baseValue, minBarLength } } = this;
    const actualBase = baseValue || 0;
    const parsed = this.getParsed(index);
    const personnalisé = analysé._personnalisé;
    const floating = isFloatBar(custom);
        soit valeur = analysé[vScale.axis];
        soit start = 0;
        soit longueur = _stacked ? this.applyStack(vScale, parsed, _stacked) : valeur;
        laisser la tête, la taille;
    si(longueur !== valeur) {
        début = longueur - valeur;
        longueur = valeur;
    }
    si(flottant) {
        valeur = personnalisé.barStart;
        longueur = custom.barEnd - custom.barStart;
        si(valeur !== 0 && signe(valeur) !== signe(custom.barEnd)) {
            début = 0;
        }
        début += valeur;
    }
    const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
        soit base = vScale.getPixelForValue(startValue);
    si(this.chart.getDataVisibility(index)) {
        tête = vScale.getPixelForValue(début + longueur);
    } autre {
        tête = base;
    }
    taille = tête - base;
    si(Math.abs(size) < minBarLength) {
        taille = signe_barre(taille, vScale, base_réelle) * longueur_barre_min;
        si(valeur === base réelle) {
            base -= taille / 2;
        }
        const startPixel = vScale.getPixelForDecimal(0);
        const endPixel = vScale.getPixelForDecimal(1);
        const min = Math.min(startPixel, endPixel);
        const max = Math.max(startPixel, endPixel);
        base = Math.max(Math.min(base, max), min);
        tête = base + taille;
        si(_empilé && !flottant) {
            parsed._stacks[vScale.axis]._visualValues[datasetIndex] = vScale.getValueForPixel(head) - vScale.getValueForPixel(base);
        }
    }
    si(base === vScale.getPixelForValue(actualBase)) {
        const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
        base += demiGrille;
        taille -= demi - grille;
    }
        retour {
        taille,
            base,
            tête,
            centre : tête + taille / 2
    };
}
_calculerBarIndexPixels(index, règle) {
    const échelle = règle.échelle;
    const options = this.options;
    const skipNull = options.skipNull;
    const maxBarThickness = valeurOuParDéfaut(options.maxBarThickness, Infini);
    centrer, taille;
    const axisCount = this._getAxisCount();
    si(ruler.grouped) {
        const stackCount = skipNull ? this._getStackCount(index) : ruler.stackCount;
        const range = options.barThickness === 'flex' ? computeFlexCategoryTraits(index, ruler, options, stackCount * axisCount) : computeFitCategoryTraits(index, ruler, options, stackCount * axisCount);
        const axisID = this.chart.options.indexAxis === 'x' ? this.getDataset().xAxisID : this.getDataset().yAxisID;
        const axisNumber = this._getAxis().indexOf(valueOrDefault(axisID, this.getFirstScaleIdForIndexAxis()));
        const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : undefined) + axisNumber;
        centre = plage.début + plage.morceau * index de pile + plage.morceau / 2;
        taille = Math.min(maxBarThickness, range.chunk * range.ratio);
    } autre {
        centre = échelle.getPixelForValue(this.getParsed(index)[échelle.axis], index);
        taille = Math.min(maxBarThickness, rule.min * rule.ratio);
    }
        retour {
        base: centre - taille / 2,
            tête : centre + taille / 2,
                centre,
                taille
    };
}
dessiner() {
    const meta = this._cachedMeta;
    const vScale = meta.vScale;
    const rects = meta.data;
    const ilen = rects.length;
        soit i = 0;
    pour(; i < ilen; ++i) {
        si(this.getParsed(i)[vScale.axis] !== null && !rects[i].hidden) {
            rects[i].draw(this._ctx);
        }
    }
}
}

classe BubbleController étend DatasetController {
    id statique = 'bulle';
 valeurs par défaut statiques = {
        datasetElementType: false,
        dataElementType: 'point',
        animations: {
            nombres: {
                type: 'nombre',
                propriétés: [
                    'x',
                    'y',
                    'largeur de bordure',
                    'rayon'
                ]
            }
        }
    };
 remplacements statiques = {
        échelles: {
            x: {
                type: 'linéaire'
            },
            y: {
                type: 'linéaire'
            }
        }
    };
    initialiser() {
        this.enableOptionSharing = true;
        super.initialiser();
    }
    analyserDonnéesPrimitives(méta, données, début, nombre) {
        const parsed = super.parsePrimitiveData(meta, data, start, count);
        pour(soit i = 0 ; i < parsed.length; i++) {
            parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
        }
        retour analysé;
    }
    analyserArrayData(méta, données, début, nombre) {
        const parsed = super.parseArrayData(meta, data, start, count);
        pour(soit i = 0 ; i < parsed.length; i++) {
            const item = data[start + i];
            parsed[i]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
        }
        retour analysé;
    }
    analyserObjectData(méta, données, début, nombre) {
        const parsed = super.parseObjectData(meta, data, start, count);
        pour(soit i = 0 ; i < parsed.length; i++) {
            const item = data[start + i];
            parsed[i]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
        }
        retour analysé;
    }
    obtenirMaxOverflow() {
        const data = this._cachedMeta.data;
        soit max = 0;
        pour(soit i = data.length - 1; i >= 0; --i) {
            max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
        }
        retourner max > 0 && max;
    }
    obtenirLabelEtValeur(index) {
        const meta = this._cachedMeta;
        const labels = this.chart.data.labels || [];
        const { xScale, yScale } = meta;
        const parsed = this.getParsed(index);
        const x = xScale.getLabelForValue(parsed.x);
        const y = yScale.getLabelForValue(parsed.y);
        const r = analysé._personnalisé;
        retour {
            étiquette: étiquettes[index] || '',
                valeur : '(' + x + ', ' + y + (r ? ', ' + r : '') + ')'
        };
    }
    mettre à jour(mode) {
        const points = this._cachedMeta.data;
        this.updateElements(points, 0, points.length, mode);
    }
    mettre à jourElements(points, départ, nombre, mode) {
        const reset = mode === 'reset';
        const { iScale, vScale } = this._cachedMeta;
        const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        pour(soit i = début; i < début + compteur; i++) {
            const point = points[i];
            const parsed = !reset && this.getParsed(i);
            propriétés constantes = {};
            const iPixel = propriétés[iAxis] = réinitialiser ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
            const vPixel = propriétés[vAxis] = réinitialiser ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
            propriétés.skip = isNaN(iPixel) || estNaN(vPixel);
            si(includeOptions) {
                propriétés.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
                si(réinitialisation) {
                    propriétés.options.rayon = 0;
                }
            }
            this.updateElement(point, i, propriétés, mode);
        }
    }
    resolveDataElementOptions(index, mode) {
        const parsed = this.getParsed(index);
        let values = super.resolveDataElementOptions(index, mode);
        si(valeurs.$shared) {
            valeurs = Object.assign({}, valeurs, {
                $shared: faux
            });
        }
        const rayon = valeurs.rayon;
        si(mode !== 'actif') {
            valeurs.rayon = 0;
        }
        valeurs.rayon += valeurOuParDéfaut(analysé && analysé._personnalisé, rayon);
        valeurs de retour;
    }
}

fonction getRatioAndOffset(rotation, circonférence, découpe) {
    soit ratioX = 1;
    soit ratioY = 1;
    soit offsetX = 0;
    soit offsetY = 0;
    si(circonférence < TAU) {
        const angleDépart = rotation;
        const endAngle = startAngle + circonférence;
        const startX = Math.cos(startAngle);
        const startY = Math.sin(startAngle);
        const endX = Math.cos(endAngle);
        const endY = Math.sin(endAngle);
        const calcMax = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
        const calcMin = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
        const maxX = calcMax(0, startX, endX);
        const maxY = calcMax(HALF_PI, startY, endY);
        const minX = calcMin(PI, startX, endX);
        const minY = calcMin(PI + HALF_PI, startY, endY);
        ratioX = (maxX - minX) / 2;
        ratioY = (maxY - minY) / 2;
        décalageX = -(maxX + minX) / 2;
        décalageY = -(maxY + minY) / 2;
    }
    retour {
        ratioX,
            ratioY,
            décalageX,
            décalageY
    };
}
classe DoughnutController étend DatasetController {
    id statique = 'beignet';
 valeurs par défaut statiques = {
        datasetElementType: false,
        dataElementType: 'arc',
        animation: {
            animateRotate: vrai,
            animateScale: false
        },
        animations: {
            nombres: {
                type: 'nombre',
                propriétés: [
                    'circonférence',
                    'endAngle',
                    'rayon intérieur',
                    'rayon extérieur',
                    'angle de départ',
                    'x',
                    'y',
                    'compenser',
                    'largeur de bordure',
                    'espacement'
                ]
            }
        },
        découpe: « 50 % »,
        rotation: 0,
        circonférence: 360,
        rayon: '100%',
        espacement: 0,
        indexAxis: 'r'
    };
    descripteurs statiques = {
        _scriptable: (nom) => nom !== 'espacement',
        _indexable: (name) => name !== 'spacing' && !name.startsWith('borderDash') && !name.startsWith('hoverBorderDash')
    };
 remplacements statiques = {
        rapport d'aspect : 1,
        plugins : {
        légende: {
            étiquettes: {
                générerÉtiquettes(graphique) {
                    const data = chart.data;
                    const { labels: { pointStyle, textAlign, color, useBorderRadius, borderRadius } } = chart.legend.options;
                    si(data.labels.length && data.datasets.length) {
                            retourner data.labels.map((label, i) => {
                        const meta = chart.getDatasetMeta(0);
                        const style = meta.controller.getStyle(i);
                                retour {
                            texte: étiquette,
                                fillStyle : style.backgroundColor,
                                    Couleur de police: couleur,
                                        caché : !chart.getDataVisibility(i),
                                            ligneTiret: style.borderTiret,
                                                lineDashOffset: style.borderDashOffset,
                                                    lineJoin: style.borderJoinStyle,
                                                        largeur de ligne: style.largeur de bordure,
                                                            style de trait: style.borderColor,
                                                                textAlign: textAlign,
                                                                    pointStyle: pointStyle,
                                                                        borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
                                                                            index : i
                        };
                    });
                    }
                    retour[];
                }
            },
            onClick(e, legendItem, legend) {
                légende.chart.toggleDataVisibility(legendItem.index);
                légende.graphique.miseàjour();
            }
        }
    }
};
constructeur(graphique, index_ensemble_de_données){
    super(graphique, index_ensemble_de_données);
    this.enableOptionSharing = true;
    this.innerRadius = indéfini;
    this.outerRadius = indéfini;
    this.offsetX = indéfini;
    this.offsetY = indéfini;
}
linkScales() { }
analyser(début, nombre) {
    const data = this.getDataset().data;
    const meta = this._cachedMeta;
    si(this._parsing === false) {
        meta._parsed = données;
    } autre {
            soit getter = (i) => +data[i];
        si(isObject(data[start])) {
            const { clé = 'valeur' } = this._parsing;
            getter = (i) => +resolveObjectKey(data[i], clé);
        }
        laissez - moi, ilen;
        for (i = début, ilen = début + count; i < ilen; ++i) {
            meta._parsed[i] = getter(i);
        }
    }
}
_getRotation() {
        retourner àRadians(this.options.rotation - 90);
}
_getCircumference() {
        retourner àRadians(this.options.circumference);
}
_getRotationExtents() {
        soit min = TAU;
        soit max = -TAU;
    pour(soit i = 0 ; i < this.chart.data.datasets.length; ++i) {
        si(this.chart.isDatasetVisible(i) && this.chart.getDatasetMeta(i).type === this._type) {
            const contrôleur = this.chart.getDatasetMeta(i).contrôleur;
            const rotation = controller._getRotation();
            const circonférence = contrôleur._getCircumference();
            min = Math.min(min, rotation);
            max = Math.max(max, rotation + circonférence);
        }
    }
        retour {
        rotation: min,
            circonférence : max - min
    };
}
 mettre à jour(mode) {
    const graphique = this.graphique;
    const { chartArea } = graphique;
    const meta = this._cachedMeta;
    const arcs = meta.data;
    const espacement = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.espacement;
    const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
    const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
    const chartWeight = this._getRingWeight(this.index);
    const { circonférence, rotation } = this._getRotationExtents();
    const { ratioX, ratioY, offsetX, offsetY } = getRatioAndOffset(rotation, circonférence, découpe);
    const maxWidth = (chartArea.width - spacing) / ratioX;
    const maxHeight = (chartArea.height - spacing) / ratioY;
    const rayonmax = Math.max(Math.min(largeurmax, hauteurmax) / 2, 0);
    const outerRadius = toDimension(this.options.radius, maxRadius);
    const innerRadius = Math.max(outerRadius * cutout, 0);
    const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
    this.offsetX = offsetX * rayon extérieur;
    this.offsetY = offsetY * rayon extérieur;
    meta.total = this.calculateTotal();
    this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
    this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
    this.updateElements(arcs, 0, arcs.length, mode);
}
_circumference(i, reset) {
    const opts = this.options;
    const meta = this._cachedMeta;
    const circonférence = this._getCircumference();
    si(reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
            renvoyer 0;
    }
        retourner this.calculateCircumference(meta._parsed[i] * circumference / TAU);
}
    mettre à jourElements(arcs, début, nombre, mode) {
    const reset = mode === 'reset';
    const graphique = this.graphique;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const animateScale = reset && animationOpts.animateScale;
    const innerRadius = animateScale ? 0 : this.innerRadius;
    const outerRadius = animateScale ? 0 : this.outerRadius;
    const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
    let startAngle = this._getRotation();
    laissez - moi;
    pour(i = 0; i < début; ++i) {
        angle_départ += this._circumference(i, réinitialisation);
    }
    pour(i = début; i < début + compteur; ++i) {
        const circonférence = this._circonférence(i, réinitialiser);
        const arc = arcs[i];
            propriétés constantes = {
            x: centreX + this.offsetX,
            y: centreY + this.offsetY,
            angle de départ,
            endAngle: startAngle + circonférence,
            circonférence,
            rayon extérieur,
            rayon intérieur
        };
        si(includeOptions) {
            propriétés.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? 'active' : mode);
        }
        angleDépart += circonférence;
        this.updateElement(arc, i, propriétés, mode);
    }
}
calculerTotal() {
    const meta = this._cachedMeta;
    const metaData = meta.data;
        soit total = 0;
    laissez - moi;
    pour(i = 0; i < metaData.length; i++) {
            valeur constante = meta._parsed[i];
        si(valeur !== null && !isNaN(valeur) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
            total += Math.abs(valeur);
        }
    }
        retour total;
}
calculerCirconcision(valeur) {
    const total = this._cachedMeta.total;
    if (total > 0 && !isNaN(value)) {
            retourner TAU * (Math.abs(valeur) / total);
    }
        renvoyer 0;
}
obtenirLabelEtValeur(index) {
    const meta = this._cachedMeta;
    const graphique = this.graphique;
    const labels = chart.data.labels || [];
    const valeur = formatNumber(meta._parsed[index], chart.options.locale);
        retour {
        étiquette: étiquettes[index] || '',
            valeur
    };
}
obtenirLargeurMaxBordure(arcs) {
        soit max = 0;
    const graphique = this.graphique;
    laissez - moi, ilen, meta, contrôleur, options;
    si(!arcs) {
        for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
            si(chart.isDatasetVisible(i)) {
                méta = graphique.getDatasetMeta(i);
                arcs = meta.data;
                contrôleur = méta.contrôleur;
                casser;
            }
        }
    }
    si(!arcs) {
            renvoyer 0;
    }
    pour(i = 0, ilen = arcs.length; i < ilen; ++i) {
        options = controller.resolveDataElementOptions(i);
        si(options.borderAlign !== 'inner') {
            max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
        }
    }
        renvoyer le maximum;
}
obtenirDécalageMax(arcs) {
        soit max = 0;
    pour(soit i = 0, ilen = arcs.length; i < ilen; ++i) {
        const options = this.resolveDataElementOptions(i);
        max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
    }
        renvoyer le maximum;
}
_getRingWeightOffset(datasetIndex) {
        soit ringWeightOffset = 0;
    pour(soit i = 0 ; i < datasetIndex; ++i) {
        si(this.chart.isDatasetVisible(i)) {
            ringWeightOffset += this._getRingWeight(i);
        }
    }
        retourner ringWeightOffset;
}
_getRingWeight(datasetIndex) {
        renvoie Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
}
_getVisibleDatasetWeightTotal() {
        retourner this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
}
}

classe LineController étend DatasetController {
    id statique = 'ligne';
 valeurs par défaut statiques = {
        datasetElementType: 'line',
        dataElementType: 'point',
        afficherLigne: vrai,
        spanGaps: faux
    };
 remplacements statiques = {
        échelles: {
            _index_: {
                type: 'catégorie'
            },
            _valeur_: {
                type: 'linéaire'
            }
        }
    };
    initialiser() {
        this.enableOptionSharing = true;
        this.supportsDecimation = true;
        super.initialiser();
    }
    mettre à jour(mode) {
        const meta = this._cachedMeta;
        const { dataset: line, data: points = [], _dataset } = meta;
        const animationsDisabled = this.chart._animationsDisabled;
        let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
        this._drawStart = début;
        this._drawCount = count;
        si(_scaleRangesChanged(meta)) {
            début = 0;
            nombre = points.longueur;
        }
        ligne._graphique = this.graphique;
        ligne._datasetIndex = this.index;
        ligne._décimée = !!_dataset._décimée;
        ligne.points = points;
        const options = this.resolveDatasetElementOptions(mode);
        si(!this.options.showLine) {
            options.borderWidth = 0;
        }
        options.segment = this.options.segment;
        this.updateElement(line, undefined, {
            animé: !animationsDésactivées,
            options
        }, mode);
        this.updateElements(points, start, count, mode);
    }
    mettre à jourElements(points, départ, nombre, mode) {
        const reset = mode === 'reset';
        const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
        const { sharedOptions, includeOptions } = this._getSharedOptions(start, mode);
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const { spanGaps, segment } = this.options;
        const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        const end = start + count;
        const pointsCount = points.length;
        let prevParsed = start > 0 && this.getParsed(start - 1);
        pour(soit i = 0 ; i < pointsCount; ++i) {
            const point = points[i];
            const propriétés = directUpdate ? point : {};
            si(i < début || i >= fin) {
                propriétés.skip = vrai;
                continuer;
            }
            const parsed = this.getParsed(i);
            const nullData = isNullOrUndef(parsed[vAxis]);
            const iPixel = propriétés[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
            const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
            propriétés.skip = isNaN(iPixel) || estNaN(vPixel) || nullDonnées;
            propriétés.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
            si(segment) {
                propriétés.analysées = analysées;
                propriétés.raw = _dataset.data[i];
            }
            si(includeOptions) {
                propriétés.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
            }
            si(!directUpdate) {
                this.updateElement(point, i, propriétés, mode);
            }
            prevParsed = analysé;
        }
    }
    obtenirMaxOverflow() {
        const meta = this._cachedMeta;
        const dataset = meta.dataset;
        const border = dataset.options && dataset.options.borderWidth || 0;
        const data = meta.data || [];
        si(!data.length) {
            retour à la bordure;
        }
        const premierPoint = données[0].size(this.resolveDataElementOptions(0));
        const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        retourner Math.max(border, premierPoint, dernierPoint) / 2;
    }
    dessiner() {
        const meta = this._cachedMeta;
        meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
        super.dessiner();
    }
}

classe PolarAreaController étend DatasetController {
    id statique = 'polarArea';
 valeurs par défaut statiques = {
        dataElementType: 'arc',
        animation: {
            animateRotate: vrai,
            animateScale: vrai
        },
        animations: {
            nombres: {
                type: 'nombre',
                propriétés: [
                    'x',
                    'y',
                    'angle de départ',
                    'endAngle',
                    'rayon intérieur',
                    'rayon extérieur'
                ]
            }
        },
        indexAxis: 'r',
        angle de départ: 0
    };
 remplacements statiques = {
        rapport d'aspect : 1,
        plugins : {
        légende: {
            étiquettes: {
                générerÉtiquettes(graphique) {
                    const data = chart.data;
                    si(data.labels.length && data.datasets.length) {
                        const { labels: { pointStyle, color } } = chart.legend.options;
                            retourner data.labels.map((label, i) => {
                            const meta = chart.getDatasetMeta(0);
                            const style = meta.controller.getStyle(i);
                                retour {
                                texte: étiquette,
                                    fillStyle : style.backgroundColor,
                                        style de trait: style.borderColor,
                                            Couleur de police: couleur,
                                                largeur de ligne: style.largeur de bordure,
                                                    pointStyle: pointStyle,
                                                        caché : !chart.getDataVisibility(i),
                                                            index : i
                            };
                        });
                    }
                    retour[];
                }
            },
            onClick(e, legendItem, legend) {
                légende.chart.toggleDataVisibility(legendItem.index);
                légende.graphique.miseàjour();
            }
        }
    },
    échelles: {
        r: {
            type: 'radialLinear',
                lignes d'angle : {
            afficher: faux
        },
        débutÀZéro: vrai,
            grille: {
            circulaire: vrai
        },
        pointLabels: {
            afficher: faux
        },
                angle de départ: 0
    }
}
    };
constructeur(graphique, index_ensemble_de_données){
    super(graphique, index_ensemble_de_données);
    this.innerRadius = indéfini;
    this.outerRadius = indéfini;
}
obtenirLabelEtValeur(index) {
    const meta = this._cachedMeta;
    const graphique = this.graphique;
    const labels = chart.data.labels || [];
    const valeur = formatNumber(meta._parsed[index].r, chart.options.locale);
        retour {
        étiquette: étiquettes[index] || '',
            valeur
    };
}
analyserObjectData(méta, données, début, nombre) {
        renvoie _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
}
    mettre à jour(mode) {
    const arcs = this._cachedMeta.data;
    this._updateRadius();
    this.updateElements(arcs, 0, arcs.length, mode);
}
obtenirMinMax() {
    const meta = this._cachedMeta;
    const range = {
        min: Nombre.POSITIVE_INFINITY,
        max: Nombre.NÉGATIVE_INFINITY
    };
    meta.data.forEach((element, index) => {
        const parsed = this.getParsed(index).r;
        si(!isNaN(parsed) && this.chart.getDataVisibility(index)) {
            si(analysé < plage.min) {
                plage.min = analysé;
            }
            si(analysé > plage.max) {
                plage.max = analysé;
            }
        }
    });
        plage de retour;
}
_updateRadius() {
    const graphique = this.graphique;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    const rayon extérieur = Math.max(taille minimale / 2, 0);
    const innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
    const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
    this.outerRadius = outerRadius - radiusLength * this.index;
    this.innerRadius = this.outerRadius - radiusLength;
}
    mettre à jourElements(arcs, début, nombre, mode) {
    const reset = mode === 'reset';
    const graphique = this.graphique;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const scale = this._cachedMeta.rScale;
    const centreX = échelle.xCenter;
    const centreY = échelle.yCenter;
    const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
        soit angle = datasetStartAngle;
    laissez - moi;
    const angleParDéfaut = 360 / this.countVisibleElements();
    pour(i = 0; i < début; ++i) {
        angle += this._computeAngle(i, mode, defaultAngle);
    }
    pour(i = début; i < début + compteur; i++) {
        const arc = arcs[i];
            soit startAngle = angle;
            soit endAngle = angle + this._computeAngle(i, mode, defaultAngle);
            soit outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(this.getParsed(i).r) : 0;
        angle = angle_fin;
        si(réinitialisation) {
            si(animationOpts.animateScale) {
                    rayon extérieur = 0;
            }
            si(animationOpts.animateRotate) {
                startAngle = endAngle = datasetStartAngle;
            }
        }
            propriétés constantes = {
            x: centreX,
            y: centreY,
            rayon intérieur: 0,
            rayon extérieur,
            angle de départ,
            angle final,
            options: this.resolveDataElementOptions(i, arc.active ? 'active' : mode)
        };
        this.updateElement(arc, i, propriétés, mode);
    }
}
compterÉlémentsVisibles() {
    const meta = this._cachedMeta;
        soit count = 0;
    meta.data.forEach((element, index) => {
        si(!isNaN(this.getParsed(index).r) && this.chart.getDataVisibility(index)) {
            compte++;
        }
    });
        nombre de retours;
}
_computeAngle(index, mode, defaultAngle) {
        retourner this.chart.getDataVisibility(index) ? toRadians(this.resolveDataElementOptions(index, mode).angle || defaultAngle) : 0;
}
}

classe PieController étend DoughnutController {
    id statique = 'pie';
 valeurs par défaut statiques = {
        découpe: 0,
        rotation: 0,
        circonférence: 360,
        rayon: '100%'
    };
}

classe RadarController étend DatasetController {
    id statique = 'radar';
 valeurs par défaut statiques = {
        datasetElementType: 'line',
        dataElementType: 'point',
        indexAxis: 'r',
        afficherLigne: vrai,
        éléments: {
            doubler: {
                remplir: 'début'
            }
        }
    };
 remplacements statiques = {
        rapport d'aspect : 1,
        échelles : {
        r: {
            type: 'radialLinear'
        }
    }
};
obtenirLabelEtValeur(index) {
    const vScale = this._cachedMeta.vScale;
    const parsed = this.getParsed(index);
        retour {
        étiquette: vScale.getLabels()[index],
            valeur : '' + vScale.getLabelForValue(parsed[vScale.axis])
    };
}
analyserObjectData(méta, données, début, nombre) {
        renvoie _parseObjectDataRadialScale.bind(this)(meta, data, start, count);
}
    mettre à jour(mode) {
    const meta = this._cachedMeta;
    const ligne = meta.dataset;
    const points = meta.data || [];
    const labels = meta.iScale.getLabels();
    ligne.points = points;
    si(mode !== 'redimensionner') {
        const options = this.resolveDatasetElementOptions(mode);
        si(!this.options.showLine) {
            options.borderWidth = 0;
        }
            propriétés constantes = {
            _boucle: vrai,
            _fullLoop: labels.length === points.length,
            options
        };
        this.updateElement(line, undefined, propriétés, mode);
    }
    this.updateElements(points, 0, points.length, mode);
}
    mettre à jourElements(points, départ, nombre, mode) {
    const scale = this._cachedMeta.rScale;
    const reset = mode === 'reset';
    pour(soit i = début; i < début + compteur; i++) {
        const point = points[i];
        const options = this.resolveDataElementOptions(i, point.active ? 'active' : mode);
        const pointPosition = scale.getPointPositionForValue(i, this.getParsed(i).r);
        const x = reset ? scale.xCenter : pointPosition.x;
        const y = reset ? scale.yCenter : pointPosition.y;
            propriétés constantes = {
            x,
            y,
            angle: pointPosition.angle,
            ignorer: isNaN(x) || isNaN(y),
            options
        };
        this.updateElement(point, i, propriétés, mode);
    }
}
}

classe ScatterController étend DatasetController {
    id statique = 'dispersion';
 valeurs par défaut statiques = {
        datasetElementType: false,
        dataElementType: 'point',
        afficherLigne: faux,
        remplir: faux
    };
 remplacements statiques = {
        interaction: {
            mode: 'point'
        },
        échelles: {
            x: {
                type: 'linéaire'
            },
            y: {
                type: 'linéaire'
            }
        }
    };
    obtenirLabelEtValeur(index) {
        const meta = this._cachedMeta;
        const labels = this.chart.data.labels || [];
        const { xScale, yScale } = meta;
        const parsed = this.getParsed(index);
        const x = xScale.getLabelForValue(parsed.x);
        const y = yScale.getLabelForValue(parsed.y);
        retour {
            étiquette: étiquettes[index] || '',
                valeur : '(' + x + ', ' + y + ')'
        };
    }
    mettre à jour(mode) {
        const meta = this._cachedMeta;
        const { données: points = [] } = méta;
        const animationsDisabled = this.chart._animationsDisabled;
        let { start, count } = _getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
        this._drawStart = début;
        this._drawCount = count;
        si(_scaleRangesChanged(meta)) {
            début = 0;
            nombre = points.longueur;
        }
        si(this.options.showLine) {
            si(!this.datasetElementType) {
                this.addElements();
            }
            const { dataset: ligne, _dataset } = meta;
            ligne._graphique = this.graphique;
            ligne._datasetIndex = this.index;
            ligne._décimée = !!_dataset._décimée;
            ligne.points = points;
            const options = this.resolveDatasetElementOptions(mode);
            options.segment = this.options.segment;
            this.updateElement(line, undefined, {
                animé: !animationsDésactivées,
                options
            }, mode);
        } sinon si(this.datasetElementType) {
            supprimer meta.dataset;
            this.datasetElementType = false;
        }
        this.updateElements(points, start, count, mode);
    }
    ajouterÉléments() {
        const { afficherLigne } = this.options;
        si(!this.datasetElementType && showLine) {
            this.datasetElementType = this.chart.registry.getElement('line');
        }
        super.addElements();
    }
    mettre à jourElements(points, départ, nombre, mode) {
        const reset = mode === 'reset';
        const { iScale, vScale, _stacked, _dataset } = this._cachedMeta;
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const { spanGaps, segment } = this.options;
        const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        let prevParsed = start > 0 && this.getParsed(start - 1);
        pour(soit i = début ; i < début + compteur; ++i) {
            const point = points[i];
            const parsed = this.getParsed(i);
            const propriétés = directUpdate ? point : {};
            const nullData = isNullOrUndef(parsed[vAxis]);
            const iPixel = propriétés[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
            const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
            propriétés.skip = isNaN(iPixel) || estNaN(vPixel) || nullDonnées;
            propriétés.stop = i > 0 && Math.abs(parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
            si(segment) {
                propriétés.analysées = analysées;
                propriétés.raw = _dataset.data[i];
            }
            si(includeOptions) {
                propriétés.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
            }
            si(!directUpdate) {
                this.updateElement(point, i, propriétés, mode);
            }
            prevParsed = analysé;
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
    }
    obtenirMaxOverflow() {
        const meta = this._cachedMeta;
        const data = meta.data || [];
        si(!this.options.showLine) {
            soit max = 0;
            pour(soit i = data.length - 1; i >= 0; --i) {
                max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
            }
            retourner max > 0 && max;
        }
        const dataset = meta.dataset;
        const border = dataset.options && dataset.options.borderWidth || 0;
        si(!data.length) {
            retour à la bordure;
        }
        const premierPoint = données[0].size(this.resolveDataElementOptions(0));
        const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        retourner Math.max(border, premierPoint, dernierPoint) / 2;
    }
}

var contrôleurs = /*#__PURE__*/Object.freeze({
    __proto__: nul,
    Contrôleur de barre: Contrôleur de barre,
    BubbleController: BubbleController,
    Contrôleur de beignet: Contrôleur de beignet,
    Contrôleur de ligne: Contrôleur de ligne,
    PieController: PieController,
    PolarAreaController: PolarAreaController,
    Contrôleur radar: Contrôleur radar,
    Contrôleur de dispersion: Contrôleur de dispersion
});

/**
 * @namespace Chart._adapters
 * @since 2.8.0
 * @privé
 */ fonction abstraite() {
    throw new Error('Cette méthode n'est pas implémentée : vérifiez qu'un adaptateur de date complet est fourni.');
}
/**
 * Adaptateur de date (courant utilisé par l'échelle de temps)
 * @namespace Chart._adapters._date
 * @memberof Chart._adapters
 * @privé
 */ class DateAdapterBase {
    /**
   * Remplacer les méthodes par défaut de l'adaptateur de date.
   * Accepte un paramètre de type pour définir le type des options.
   * @exemple
   * Chart._adapters._date.override<{myAdapterOption: string}>({
   * init() {
   console.log(this.options.myAdapterOption);
   * }
   * })
   */ static override(membres) {
        Objet.assigner(DateAdapterBase.prototype, membres);
    }
    options;
    constructeur(options) {
        this.options = options || {};
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() { }
    formats() {
        retourner abstrait();
    }
    analyser() {
        retourner abstrait();
    }
    format() {
        retourner abstrait();
    }
    ajouter() {
        retourner abstrait();
    }
    diff() {
        retourner abstrait();
    }
    débutDe() {
        retourner abstrait();
    }
    finDe() {
        retourner abstrait();
    }
}
var adaptateurs = {
    _date: DateAdapterBase
};

fonction binarySearch(metaset, axis, value, intersect) {
    const { contrôleur, données, _trié } = métaensemble;
    const iScale = controller._cachedMeta.iScale;
    const spanGaps = metaset.dataset ? metaset.dataset.options ? metaset.dataset.options.spanGaps : null : null;
    si(iScale && axis === iScale.axis && axis !== 'r' && _sorted && data.length) {
        const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
        si(!intersection) {
            const résultat = lookupMethod(données, axe, valeur);
            si(spanGaps) {
                const { vScale } = controller._cachedMeta;
                const { _parsed } = metaset;
                const distanceToDefinedLo = _parsed.slice(0, result.lo + 1).reverse().findIndex((point) => !isNullOrUndef(point[vScale.axis]));
                résultat.lo -= Math.max(0, distanceToDefinedLo);
                const distanceToDefinedHi = _parsed.slice(result.hi).findIndex((point) => !isNullOrUndef(point[vScale.axis]));
                résultat.hi += Math.max(0, distanceToDefinedHi);
            }
            renvoyer le résultat;
        } sinon si(controller._sharedOptions) {
            const el = données[0];
            const range = typeof el.getRange === 'fonction' && el.getRange(axis);
            si(plage) {
                const start = lookupMethod(data, axis, value - range);
                const end = lookupMethod(data, axis, value + range);
                retour {
                    lo: start.lo,
                        Salut : fin.salut
                };
            }
        }
    }
    retour {
        lo: 0,
            Salut : data.length - 1
    };
}
 fonction evaluateInteractionItems(graphique, axe, position, gestionnaire, intersection) {
    const metasets = chart.getSortedVisibleDatasetMetas();
    valeur constante = position[axe];
    pour(soit i = 0, ilen = metasets.length; i < ilen; ++i) {
        const { index, data } = metasets[i];
        const { lo, hi } = binarySearch(metasets[i], axis, value, intersect);
        pour(soit j = lo; j <= hi; ++j) {
            const élément = données[j];
            si(!élément.skip) {
                gestionnaire(élément, index, j);
            }
        }
    }
}
 fonction getDistanceMetricForAxis(axis) {
    const useX = axis.indexOf('x') !== -1;
    const useY = axis.indexOf('y') !== -1;
    retourner la fonction(pt1, pt2) {
        const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
        const deltaY = utiliserY ? Math.abs(pt1.y - pt2.y) : 0;
        renvoie Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    };
}
 fonction getIntersectItems(graphique, position, axe, utiliserPositionFinal, inclureInvisible) {
    const items = [];
    si(!includeInvisible && !chart.isPointInArea(position)) {
        retourner les articles;
    }
    const evaluationFunc = function (element, datasetIndex, index) {
        if (!includeInvisible && !_isPointInArea(element, chart.chartArea, 0)) {
            retour;
        }
        si(élément.dansLaPlage(position.x, position.y, utiliserPositionFinal)) {
            articles.push({
                élément,
                index du jeu de données,
                indice
            });
        }
    };
    évaluerLesÉlémentsInteraction(graphique, axe, position, fonctionÉvaluation, vrai);
    retourner les articles;
}
 fonction getNearestRadialItems(chart, position, axis, useFinalPosition) {
    soit items = [];
    fonction evaluationFunc(élément, index_ensemble_de_données, index) {
        const { startAngle, endAngle } = element.getProps([
            'angle de départ',
            'endAngle'
        ], utiliserFinalPosition);
        const { angle } = getAngleFromPoint(élément, {
            x: position.x,
            y: position.y
        });
        if (_angleBetween(angle, startAngle, endAngle)) {
            articles.push({
                élément,
                index du jeu de données,
                indice
            });
        }
    }
    évaluerLesÉlémentsInteraction(graphique, axe, position, fonctionÉvaluation);
    retourner les articles;
}
 fonction getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible) {
    soit items = [];
    const distanceMetric = getDistanceMetricForAxis(axis);
    soit minDistance = Nombre.POSITIVE_INFINITY;
    fonction evaluationFunc(élément, index_ensemble_de_données, index) {
        const inRange = element.inRange(position.x, position.y, useFinalPosition);
        si(intersection && !dansLaPlage) {
            retour;
        }
        const centre = élément.getCenterPoint(useFinalPosition);
        const pointInArea = !!includeInvisible || chart.isPointInArea(center);
        si(!pointInArea && !inRange) {
            retour;
        }
        const distance = distanceMetric(position, centre);
        si(distance < minDistance) {
            articles = [
                {
                    élément,
                    index du jeu de données,
                    indice
                }
            ];
            Distance minimale = distance;
        } sinon si(distance === distance minimale) {
            articles.push({
                élément,
                index du jeu de données,
                indice
            });
        }
    }
    évaluerLesÉlémentsInteraction(graphique, axe, position, fonctionÉvaluation);
    retourner les articles;
}
 fonction getNearestItems(graphique, position, axe, intersection, utiliserPositionFinal, inclureInvisible) {
    si(!includeInvisible && !chart.isPointInArea(position)) {
        retour[];
    }
    return axis === 'r' && !intersect ? getNearestRadialItems(chart, position, axis, useFinalPosition) : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition, includeInvisible);
}
 fonction getAxisItems(chart, position, axis, intersect, useFinalPosition) {
    const items = [];
    const rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange';
    soit intersectsItem = faux;
    évaluerLesÉlémentsInteraction(graphique, axe, position, (élément, indexEnsembleDeDonnées, index) => {
        si(élément[rangeMethod] && élément[rangeMethod](position[axis], useFinalPosition)) {
            articles.push({
                élément,
                index du jeu de données,
                indice
            });
            intersectsItem = intersectsItem || element.inRange(position.x, position.y, useFinalPosition);
        }
    });
    si(intersection && !intersectsItem) {
        retour[];
    }
    retourner les articles;
}
var Interaction = {
    évaluer les éléments d'interaction,
    modes: {
        index (graphique, e, options, utiliserPositionFinal) {
            const position = getRelativePosition(e, chart);
            const axe = options.axe || 'x';
            const includeInvisible = options.includeInvisible || false;
            const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
            éléments constants = [];
            si(!items.length) {
                retour[];
            }
            chart.getSortedVisibleDatasetMetas().forEach((meta) => {
                const index = items[0].index;
                const élément = meta.data[index];
                si(élément && !élément.skip) {
                    éléments.push({
                        élément,
                        index du jeu de données: meta.index,
                        indice
                    });
                }
            });
            renvoyer les éléments;
        },
            ensemble de données(graphique, e, options, utiliserPositionFinal) {
    const position = getRelativePosition(e, chart);
    const axe = options.axe || 'xy';
    const includeInvisible = options.includeInvisible || false;
    let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible) : getNearestItems(chart, position, axis, false, useFinalPosition, includeInvisible);
    si(items.length > 0) {
        const datasetIndex = items[0].datasetIndex;
        const data = chart.getDatasetMeta(datasetIndex).data;
        articles = [];
        pour(soit i = 0 ; i < data.length; ++i) {
            articles.push({
                élément: données[i],
                index du jeu de données,
                index: i
            });
        }
    }
            retourner les articles;
},
point(graphique, e, options, utiliserPositionFinal) {
    const position = getRelativePosition(e, chart);
    const axe = options.axe || 'xy';
    const includeInvisible = options.includeInvisible || false;
            renvoie getIntersectItems(chart, position, axis, useFinalPosition, includeInvisible);
},
 plus proche(graphique, e, options, utiliserPositionFinal) {
    const position = getRelativePosition(e, chart);
    const axe = options.axe || 'xy';
    const includeInvisible = options.includeInvisible || false;
            renvoie getNearestItems(chart, position, axis, options.intersect, useFinalPosition, includeInvisible);
},
x(graphique, e, options, utiliserPositionFinal) {
    const position = getRelativePosition(e, chart);
            renvoie getAxisItems(chart, position, 'x', options.intersect, useFinalPosition);
},
y(graphique, e, options, utiliserPositionFinal) {
    const position = getRelativePosition(e, chart);
            renvoie getAxisItems(chart, position, 'y', options.intersect, useFinalPosition);
}
    }
};

const STATIC_POSITIONS = [
    'gauche',
    'haut',
    'droite',
    'bas'
];
fonction filterByPosition(tableau, position) {
    retourner array.filter((v) => v.pos === position);
}
fonction filterDynamicPositionByAxis(tableau, axe) {
    return array.filter((v) => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
}
fonction trierParPoids(tableau, inverse) {
    retourner array.sort((a, b) => {
    const v0 = inverse ? b : a;
    const v1 = inverser ? a : b;
        retourner v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
});
}
fonction wrapBoxes(boxes) {
    const layoutBoxes = [];
    soit i, ilen, boîte, pos, pile, poids de pile;
    pour(i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
        boîte = boîtes[i];
        ({ position: pos, options: { stack, stackWeight =1 } } = boîte);
        layoutBoxes.push({
            index: i,
            boîte,
            pos,
            horizontal: box.isHorizontal(),
            poids: poids de la boîte,
            pile: pile && pos + pile,
            poids de la pile
        });
    }
    retourner layoutBoxes;
}
fonction construirePiles(layouts) {
    const piles = {};
    pour(const wrap de mises en page) {
        const { pile, pos, poidsPile } = envelopper;
    si(!stack || !STATIC_POSITIONS.includes(pos)) {
        continuer;
    }
    const _stack = stacks[stack] || (stacks[stack] = {
        nombre: 0,
        placé: 0,
        poids: 0,
        taille: 0
    });
    _stack.count++;
    _stack.weight += stackWeight;
}
    renvoyer les piles;
}
 fonction setLayoutDims(layouts, params) {
    const stacks = buildStacks(layouts);
    const { vBoxMaxWidth, hBoxMaxHeight } = params;
    laissez - moi, ilen, disposition;
    pour(i = 0, ilen = layouts.length; i < ilen; ++i) {
        disposition = dispositions[i];
        const { fullSize } = layout.box;
        const pile = piles[layout.pile];
        const facteur = pile && layout.stackWeight / pile.weight;
        si(layout.horizontal) {
            layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
            layout.height = hBoxMaxHeight;
        } autre {
            layout.width = vBoxMaxWidth;
            layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
        }
    }
    renvoyer les piles;
}
fonction construireLayoutBoxes(boîtes) {
    const layoutBoxes = wrapBoxes(boxes);
    const fullSize = sortByWeight(layoutBoxes.filter((wrap) => wrap.box.fullSize), true);
    const gauche = trierParPoids(filtrerParPosition(layoutBoxes, 'gauche'), vrai);
    const right = sortByWeight(filterByPosition(layoutBoxes, 'right'));
    const top = sortByWeight(filterByPosition(layoutBoxes, 'top'), true);
    const bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom'));
    const centreHorizontal = filtrePositionDynamicParAxis(layoutBoxes, 'x');
    const centreVertical = filtrePositionDynamicParAxis(layoutBoxes, 'y');
    retour {
        pleine taille,
            gaucheEtHaut : gauche.concat(haut),
                droiteEtBas : droite.concat(centreVertical).concat(bas).concat(centreHorizontal),
                    chartArea : filterByPosition(layoutBoxes, 'chartArea'),
                        vertical : gauche.concat(droite).concat(centreVertical),
                            horizontal : haut.concat(bas).concat(centreHorizontal)
    };
}
fonction getCombinedMax(maxPadding, chartArea, a, b) {
    retourner Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
}
fonction updateMaxPadding(maxPadding, boxPadding) {
    maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
    maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
    maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
    maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
}
fonction updateDims(chartArea, params, layout, stacks) {
    const { pos, box } = layout;
    const maxPadding = chartArea.maxPadding;
    si(!isObject(pos)) {
        si(layout.size) {
            chartArea[pos] -= layout.size;
        }
        const pile = piles[layout.stack] || {
            taille: 0,
            nombre: 1
        };
        pile.taille = Math.max(pile.taille, disposition.horizontale ? boîte.hauteur : boîte.largeur);
        taille de la mise en page = taille de la pile / nombre de piles;
        chartArea[pos] += layout.size;
    }
    si(box.getPadding) {
        mettre à jourMaxPadding(maxPadding, box.getPadding());
    }
    const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right'));
    const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom'));
    const largeurChanged = nouvelleLargeur !== zoneGraphique.w;
    const hauteurChanged = nouvelleHauteur !== zoneGraphique.h;
    chartArea.w = nouvelleLargeur;
    chartArea.h = nouvelleHauteur;
    retourner layout.horizontal ? {
        même: largeur modifiée,
        autre: hauteur modifiée
    } : {
        même: hauteur modifiée,
        autre: largeur modifiée
    };
}
fonction handleMaxPadding(chartArea) {
    const maxPadding = chartArea.maxPadding;
    fonction updatePos(pos) {
        const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
        chartArea[pos] += changement;
        rendre la monnaie;
    }
    chartArea.y += updatePos('top');
    chartArea.x += updatePos('left');
    mettre à jourPosition('droite');
    mettre à jourPosition('bas');
}
fonction getMargins(horizontal, chartArea) {
    const maxPadding = chartArea.maxPadding;
    fonction marginForPositions(positions) {
        const margin = {
            gauche: 0,
            haut: 0,
            droite: 0,
            bas: 0
        };
        positions.forEach((pos) => {
            marge[pos] = Math.max(chartArea[pos], maxPadding[pos]);
        });
        marge de retour;
    }
    retourner horizontal ? margePourPositions([
        'gauche',
        'droite'
    ]) : margePourPositions([
        'haut',
        'bas'
    ]);
}
fonction fitBoxes(boxes, chartArea, params, stacks) {
    const refitBoxes = [];
    laissez - moi, ilen, disposition, boîte, réaménagement, changé;
    pour(i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
        disposition = boîtes[i];
        boîte = mise en page.boîte;
        boîte.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
        const { même, autre } = updateDims(chartArea, params, layout, stacks);
        refit |= même && refitBoxes.longueur;
        modifié = modifié || autre;
        si(!box.fullSize) {
            refitBoxes.push(layout);
        }
    }
    retourner refit && fitBoxes(refitBoxes, chartArea, params, stacks) || modifié;
}
fonction setBoxDims(boîte, gauche, haut, largeur, hauteur) {
    boîte.haut = haut;
    boîte.gauche = gauche;
    boîte.droite = gauche + largeur;
    boîte.bas = haut + hauteur;
    boîte.largeur = largeur;
    boîte.hauteur = hauteur;
}
fonction placeBoxes(boxes, chartArea, params, stacks) {
    const userPadding = params.padding;
    soit { x, y } = chartArea;
    pour(const layout des boîtes) {
        const boîte = mise en page.boîte;
    const pile = piles[layout.stack] || {
        nombre: 1,
        placé: 0,
        poids: 1
    };
    const poids = layout.stackWeight / stack.weight || 1;
    si(layout.horizontal) {
        const largeur = zone de graphique.w * poids;
            hauteur constante = pile.taille || boîte.hauteur;
        si(défini(stack.start)) {
            y = pile.début;
        }
        si(boîte.fullSize) {
            setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
        } autre {
            setBoxDims(box, chartArea.left + stack.placed, y, width, height);
        }
        pile.début = y;
        pile.placée += largeur;
        y = boîte.bas;
    } autre {
        const hauteur = chartArea.h * poids;
        const largeur = pile.taille || boîte.largeur;
        si(défini(stack.start)) {
            x = pile.début;
        }
        si(boîte.fullSize) {
            setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
        } autre {
            setBoxDims(box, x, chartArea.top + stack.placed, width, height);
        }
        pile.début = x;
        pile.placée += hauteur;
        x = boîte.droite;
    }
}
chartArea.x = x;
chartArea.y = y;
}
var mises en page = {
    ajouterBox(graphique, élément) {
        si(!chart.boxes) {
            graphique.boîtes = [];
        }
        article.fullSize = article.fullSize || faux;
        élément.position = élément.position || 'haut';
        article.poids = article.poids || 0;
        item._layers = item._layers || function () {
            retour[
                {
                    z: 0,
                    dessiner(zone graphique) {
                        élément.dessiner(zone de graphique);
                    }
                }
            ];
        };
        graphique.boîtes.push(élément);
    },
    supprimerBox(graphique, élément de mise en page) {
        const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
        si(index !== -1) {
            chart.boxes.splice(index, 1);
        }
    },
    configurer(graphique, élément, options) {
        article.fullSize = options.fullSize;
        élément.position = options.position;
        article.poids = options.poids;
    },
    mettre à jour(graphique, largeur, hauteur, marge minimale) {
        si(!graphique) {
            retour;
        }
        const padding = toPadding(chart.options.layout.padding);
        const availableWidth = Math.max(width - padding.width, 0);
        const availableHeight = Math.max(height - padding.height, 0);
        const boxes = buildLayoutBoxes(chart.boxes);
        const verticalBoxes = boxes.vertical;
        const horizontalBoxes = boxes.horizontal;
        chaque(graphique.boîtes, (boîte) => {
            si(typeof box.beforeLayout === 'function') {
                boîte.avantLayout();
            }
        });
        const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
        const params = Object.freeze({
            largeurextérieure: largeur,
            Hauteur extérieure: hauteur,
            rembourrage,
            largeur disponible,
            disponibleHauteur,
            vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
            hBoxMaxHeight: hauteur disponible / 2
        });
const maxPadding = Object.assign({}, padding);
        mettre à jourMaxPadding(maxPadding, toPadding(minPadding));
const chartArea = Object.assign({
    maxPadding,
    w: largeur disponible,
    h: hauteur disponible,
    x: padding.gauche,
    y: padding.top
}, rembourrage);
const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
fitBoxes(boxes.fullSize, chartArea, params, stacks);
fitBoxes(verticalBoxes, chartArea, params, stacks);
si(fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
    fitBoxes(verticalBoxes, chartArea, params, stacks);
}
gérerMaxPadding(chartArea);
placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
chartArea.x += chartArea.w;
chartArea.y += chartArea.h;
placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
graphique.zone_graphique = {
    gauche: chartArea.gauche,
    haut: chartArea.top,
    droite: chartArea.left + chartArea.w,
    en bas: chartArea.top + chartArea.h,
    hauteur: chartArea.h,
    largeur: chartArea.w
};
chaque(boxes.chartArea, (layout) => {
    const boîte = mise en page.boîte;
    Objet.assigner(boîte, graphique.zone_graphique);
    box.update(chartArea.w, chartArea.h, {
        gauche: 0,
        haut: 0,
        droite: 0,
        bas: 0
    });
});
    }
};

classe BasePlatform {
    acquérirContexte(canvas, rapportaspect) { }
    releaseContext(contexte) {
        renvoyer faux;
    }
    addEventListener(graphique, type, écouteur) { }
    supprimerEventListener(graphique, type, écouteur) { }
    obtenirDevicePixelRatio() {
        renvoyer 1;
    }
    obtenirTailleMaximale(élément, largeur, hauteur, rapport d'aspect) {
        largeur = Math.max(0, largeur || élément.largeur);
    hauteur = hauteur || élément.hauteur;
        retour {
        largeur,
            hauteur : Math.max(0, rapport d'aspect ? Math.floor(largeur / rapport d'aspect) : hauteur)
    };
}
estAttaché(canvas) {
        renvoyer vrai;
}
 mettre à jourConfig(config) {
}
}

classe BasicPlatform étend BasePlatform {
    acquérirContexte(élément) {
        retourner l'élément && item.getContext && item.getContext('2d') || null;
    }
    mettre à jourConfig(config) {
        config.options.animation = false;
    }
}

const EXPANDO_KEY = '$chartjs';
const EVENT_TYPES = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    pointeurenter: 'mouseenter',
    pointerdown: 'mousedown',
    pointermove: 'mousemove',
    pointeur: 'mouseup',
    pointerleave: 'mouseout',
    pointerout: 'mouseout'
};
const isNullOrEmpty = (value) => value === null || value === '';
 fonction initCanvas(canvas, rapportaspect) {
    const style = canvas.style;
    const renderHeight = canvas.getAttribute('height');
    const renderWidth = canvas.getAttribute('width');
    canvas[EXPANDO_KEY] = {
        initial: {
            hauteur: hauteur de rendu,
            largeur: largeur de rendu,
            style: {
                affichage: style.affichage,
                hauteur: style.hauteur,
                largeur: style.largeur
            }
        }
    };
    style.display = style.display || 'block';
    style.boxSizing = style.boxSizing || 'border-box';
    si(isNullOrEmpty(renderWidth)) {
        const displayWidth = readUsedSize(canvas, 'width');
        si(displayWidth !== undefined) {
            canvas.width = displayWidth;
        }
    }
    si(estNullOuVide(hauteurRendu)) {
        si(canvas.style.height === '') {
            hauteur du canevas = largeur du canevas / (ratio d'aspect || 2);
        } autre {
            const displayHeight = readUsedSize(canvas, 'height');
            si(displayHeight !== undefined) {
                canvas.height = displayHeight;
            }
        }
    }
    retour canevas;
}
const eventListenerOptions = supportsEventListenerOptions ? {
    passif: vrai
} : FAUX;
fonction ajouterÉcouteur(nœud, type, écouteur) {
    si(nœud) {
        nœud.addEventListener(type, listener, eventListenerOptions);
    }
}
fonction supprimerListener(graphique, type, écouteur) {
    si(graphique && graphique.canvas) {
        chart.canvas.removeEventListener(type, listener, eventListenerOptions);
    }
}
fonction fromNativeEvent(événement, graphique) {
    const type = EVENT_TYPES[event.type] || event.type;
    const { x, y } = getRelativePosition(événement, graphique);
    retour {
        taper,
            graphique,
            natif : événement,
                x : x !== undefined ? x : null,
                    y : y !== undefined ? y : null
    };
}
fonction nodeListContains(nodeList, canvas) {
    pour(const nœud de nodeList) {
        si (nœud === canvas || nœud.contains(canvas)) {
            renvoyer vrai;
    }
}
}
fonction créerAttachObserver(graphique, type, écouteur) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entrées) => {
        soit trigger = faux;
        pour(const entrée des entrées){
            déclencheur = déclencheur || nodeListContains(entrée.addedNodes, canvas);
    déclencheur = déclencheur && !nodeListContains(entry.removedNodes, canvas);
}
si(déclencheur) {
    auditeur();
}
    });
observer.observer(document, {
    liste d'enfants : vrai,
        sous - arbre : vrai
});
    observateur de retour;
}
fonction créerDetachObserver(graphique, type, écouteur) {
    const canvas = chart.canvas;
    const observer = new MutationObserver((entrées) => {
        soit trigger = faux;
        pour(const entrée des entrées){
            déclencheur = déclencheur || nodeListContains(entrée.removedNodes, canvas);
    déclencheur = déclencheur && !nodeListContains(entrée.addedNodes, canvas);
}
si(déclencheur) {
    auditeur();
}
    });
observer.observer(document, {
    liste d'enfants : vrai,
        sous - arbre : vrai
});
    observateur de retour;
}
const drpListeningCharts = new Map();
soit oldDevicePixelRatio = 0;
fonction onWindowResize() {
    const dpr = window.devicePixelRatio;
    si(dpr === oldDevicePixelRatio) {
        retour;
    }
    ancienRatioPixelDevice = dpr;
    drpListeningCharts.forEach((resize, chart) => {
        si(chart.currentDevicePixelRatio !== dpr) {
            redimensionner();
        }
    });
}
fonction listenDevicePixelRatioChanges(chart, resize) {
    si(!drpListeningCharts.size) {
        fenêtre.addEventListener('resize', onWindowResize);
    }
    drpListeningCharts.set(chart, resize);
}
fonction unlistenDevicePixelRatioChanges(chart) {
    drpListeningCharts.supprimer(graphique);
    si(!drpListeningCharts.size) {
        fenêtre.supprimerEventListener('resize', onWindowResize);
    }
}
fonction créerResizeObserver(graphique, type, écouteur) {
    const canvas = chart.canvas;
    const conteneur = toile && _getParentNode(canvas);
    si(!conteneur) {
        retour;
    }
    const redimensionner = limité((largeur, hauteur) => {
        const w = container.clientWidth;
        écouteur(largeur, hauteur);
        si(w < container.clientWidth) {
            auditeur();
        }
    }, fenêtre);
    const observer = new ResizeObserver((entrées) => {
        const entrée = entrées[0];
        const largeur = entrée.contentRect.largeur;
        const hauteur = entrée.contentRect.hauteur;
        si(largeur === 0 && hauteur === 0) {
            retour;
        }
        redimensionner(largeur, hauteur);
    });
    observer.observer(conteneur);
    écouterChangementsPixelsDuPériphérique(graphique, redimensionner);
    observateur de retour;
}
fonction releaseObserver(graphique, type, observateur) {
    si(observateur) {
        observer.disconnect();
    }
    si(type === 'redimensionner') {
        unlistenDevicePixelRatioChanges(chart);
    }
}
fonction créerProxyEtÉcouter(graphique, type, écouteur) {
    const canvas = chart.canvas;
    const proxy = throttled((événement) => {
        si(chart.ctx !== null) {
            écouteur(deNativeEvent(événement, graphique));
        }
    }, graphique);
    ajouterListener(canvas, type, proxy);
    renvoyer le proxy;
}
 la classe DomPlatform étend BasePlatform {
    acquérirContexte(canvas, rapportaspect) {
        const context = canvas && canvas.getContext && canvas.getContext('2d');
        si(contexte && contexte.canvas === canvas) {
            initCanvas(canvas, aspectRatio);
            renvoyer le contexte;
        }
        renvoyer null;
    }
    releaseContext(contexte) {
        const canvas = context.canvas;
        si(!canvas[EXPANDO_KEY]) {
            renvoyer faux;
        }
        const initial = canvas[EXPANDO_KEY].initial;
        [
            'hauteur',
            'largeur'
        ].forEach((prop) => {
            valeur constante = initial[prop];
            si(isNullOrUndef(valeur)) {
                canvas.removeAttribute(prop);
            } autre {
                canvas.setAttribute(prop, valeur);
            }
        });
        const style = initial.style || {};
        Objet.clés(style).forEach((clé) => {
            canvas.style[clé] = style[clé];
        });
        canvas.largeur = canvas.largeur;
        supprimer canvas[EXPANDO_KEY];
        renvoyer vrai;
    }
    addEventListener(graphique, type, écouteur) {
        this.removeEventListener(chart, type);
        const proxys = chart.$proxies || (chart.$proxies = {});
        gestionnaires const = {
            attacher: créerAttachObserver,
            détacher: créerDetachObserver,
            redimensionner: créerResizeObserver
        };
        const handler = handlers[type] || createProxyAndListen;
        proxys[type] = gestionnaire(graphique, type, écouteur);
    }
    supprimerEventListener(graphique, type) {
        const proxys = chart.$proxies || (chart.$proxies = {});
        const proxy = proxys[type];
        si(!proxy) {
            retour;
        }
        gestionnaires const = {
            attacher: releaseObserver,
            détacher: releaseObserver,
            redimensionner: releaseObserver
        };
        const gestionnaire = gestionnaires[type] || supprimerÉcouteur;
        gestionnaire(graphique, type, proxy);
        proxys[type] = non défini;
    }
    obtenirDevicePixelRatio() {
        retourner window.devicePixelRatio;
    }
    obtenirTailleMaximale(canvas, largeur, hauteur, rapportaspect) {
        renvoie getMaximumSize(canvas, largeur, hauteur, rapport d'aspect);
    }
    estAttaché(canvas) {
        const conteneur = toile && _getParentNode(canvas);
        retourner!!(conteneur && conteneur.estConnecté);
    }
}

fonction _detectPlatform(canvas) {
    si(!_isDomSupported() || typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
        retourner BasicPlatform;
    }
    retourner DomPlatform;
}

classe Élément {
    valeurs par défaut statiques = {};
    Routes par défaut statiques = non défini;
    x;
    y;
    actif = faux;
    options;
    $animations;
    tooltipPosition(useFinalPosition) {
        const { x, y } = this.getProps([
            'x',
            'y'
        ], utiliserFinalPosition);
        retour {
            x,
                y
        };
    }
    aValeur() {
        renvoie isNumber(this.x) && isNumber(this.y);
    }
    getProps(props, final) {
        const anims = this.$animations;
        si(!final || !anims) {
            Évitons de créer un objet si ce n'est pas nécessaire.
            renvoyer ceci;
        }
        const ret = {};
        props.forEach((prop) => {
            ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
        });
        renvoyer ret;
    }
}

fonction autoSkip(échelle, ticks) {
    const tickOpts = scale.options.ticks;
    const determinedMaxTicks = determineMaxTicks(scale);
    const ticksLimit = Math.min(tickOpts.maxTicksLimit || determinedMaxTicks, determinedMaxTicks);
    const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
    const numMajorIndices = majorIndices.length;
    const premier = indicesprincipaux[0];
    const dernier = indexMajeur[numIndicesMajeur - 1];
    const newTicks = [];
    si(numMajorIndices > ticksLimit) {
        ignorer les indices majeurs(ticks, nouveaux indices, indices majeurs, nombre d'indices majeurs / limite de ticks);
        renvoyer newTicks ;
    }
    const espacement = calculerEspacement(indicesprincipaux, graduations, limitegradues);
    si(numMajorIndices > 0) {
        laissez - moi, ilen;
        const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
        ignorer(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : premier - avgMajorSpacing, premier);
        pour(i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
            ignorer(ticks, nouveauxTicks, espacement, indicesprincipaux[i], indicesprincipaux[i + 1]);
        }
        ignorer(ticks, newTicks, espacement, dernier, estNullOuIndéfini(espacementMajorMoy) ? ticks.length : dernier + espacementMajorMoy);
        renvoyer newTicks;
    }
    ignorer(ticks, nouveauxTicks, espacement);
    renvoyer newTicks;
}
fonction déterminerMaxTicks(échelle) {
    const offset = scale.options.offset;
    const tickLength = scale._tickSize();
    const maxScale = scale._length / tickLength + (offset ? 0 : 1);
    const maxChart = scale._maxLength / tickLength;
    retourner Math.floor(Math.min(maxScale, maxChart));
}
 fonction calculerEspacement(indicesprincipaux, graduations, limite de graduations) {
    const evenMajorSpacing = getEvenSpacing(majorIndices);
    espacement constant = ticks.length / ticksLimit;
    si(!evenMajorSpacing) {
        renvoie Math.max(espacement, 1);
    }
    const facteurs = _factorize(evenMajorSpacing);
    pour(soit i = 0, ilen = facteurs.longueur - 1; i < ilen; i++) {
        const facteur = facteurs[i];
        si(facteur > espacement) {
            facteur de rendement;
        }
    }
    renvoie Math.max(espacement, 1);
}
 fonction getMajorIndices(ticks) {
    const résultat = [];
    laissez - moi, ilen;
    pour(i = 0, ilen = ticks.length; i < ilen; i++) {
        si(ticks[i].major) {
            résultat.push(i);
        }
    }
    renvoyer le résultat;
}
 fonction skipMajors(ticks, newTicks, majorIndices, spacing) {
    soit count = 0;
    soit suivant = index_major[0];
    laissez - moi;
    espacement = Math.ceil(espacement);
    pour(i = 0; i < ticks.length; i++) {
        si(i === suivant) {
            newTicks.push(ticks[i]);
            compte++;
            suivant = indicesprincipaux[nombre * espacement];
        }
    }
}
 fonction skip(ticks, newTicks, spacing, majorStart, majorEnd) {
    const start = valeurOuParDéfaut(majorStart, 0);
    const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
    soit count = 0;
    soit longueur, i, suivant;
    espacement = Math.ceil(espacement);
    si(majorEnd) {
        longueur = majorEnd - majorStart;
        espacement = longueur / Math.floor(longueur / espacement);
    }
    suivant = début;
    tant que(suivant < 0){
        compte++;
        suivant = Math.round(début + nombre * espacement);
    }
    pour(i = Math.max(début, 0); i < fin; i++) {
        si(i === suivant) {
            newTicks.push(ticks[i]);
            compte++;
            suivant = Math.round(début + nombre * espacement);
        }
    }
}
 fonction getEvenSpacing(arr) {
    const len = arr.length;
    soit i, diff;
    si(len < 2) {
        renvoyer faux;
    }
    pour(diff = arr[0], i = 1; i < len; ++i) {
        si(arr[i] - arr[i - 1] !== diff) {
            renvoyer faux;
        }
    }
    renvoyer diff;
}

const reverseAlign = (align) => align === 'left' ? 'right' : align === 'right' ? 'left' : align;
const offsetFromEdge = (scale, edge, offset) => edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;
const getTicksLength = (ticksLength, maxTicksLength) => Math.min(maxTicksLength || ticksLength, ticksLength);
 échantillon de fonction(arr, numItems) {
    const résultat = [];
    const incrément = arr.length / numItems;
    const len = arr.length;
    soit i = 0;
    pour(; i < len; i += incrément) {
        résultat.push(arr[Math.floor(i)]);
    }
    renvoyer le résultat;
}
 fonction getPixelForGridLine(échelle, index, offsetGridLines) {
    longueur constante = échelle.ticks.longueur;
    const validIndex = Math.min(index, longueur - 1);
    const start = scale._startPixel;
    const end = scale._endPixel;
    const epsilon = 1e-6;
    let lineValue = scale.getPixelForTick(validIndex);
    laisser décalage;
    si(offsetGridLines) {
        si(longueur === 1) {
            décalage = Math.max(lineValue - début, fin - lineValue);
        } sinon si(index === 0) {
            décalage = (échelle.getPixelForTick(1) - valeurLigne) / 2;
        } autre {
            décalage = (valeur_ligne - échelle.getPixelForTick(index_valide - 1)) / 2;
        }
        valeur_ligne += index_valide < index ? décalage : -décalage;
        si(lineValue < start - epsilon || lineValue > end + epsilon) {
            retour;
        }
    }
    renvoyer lineValue;
}
 fonction garbageCollect(caches, longueur) {
    chaque(caches, (cache) => {
        const gc = cache.gc;
        const gcLen = gc.length / 2;
        laissez - moi;
        si(gcLen > longueur) {
            pour(i = 0; i < gcLen; ++i){
                supprimer cache.data[gc[i]];
    }
    gc.splice(0, gcLen);
}
    });
}
 fonction getTickMarkLength(options) {
    retourner options.drawTicks ? options.tickLength : 0;
}
 fonction getTitleHeight(options, fallback) {
    si(!options.display) {
        renvoyer 0;
    }
    const police = toFont(options.police, fallback);
    const padding = toPadding(options.padding);
    const lignes = isArray(options.text) ? options.text.length : 1;
    retourner lignes * font.lineHeight + padding.height;
}
fonction créerContexteÉchelle(parent, échelle) {
    retourner createContext(parent, {
    échelle,
    type: 'échelle'
});
}
fonction créerTickContext(parent, index, tick) {
    retourner createContext(parent, {
    cocher,
    indice,
    type: 'tic'
});
}
fonction titleAlign(alignement, position, inverse) {
    let ret = _toLeftRightCenter(align);
    si(inversé && position !== 'droite' || !inversé && position === 'droite') {
        ret = reverseAlign(ret);
    }
    renvoyer ret;
}
fonction titleArgs(échelle, décalage, position, alignement) {
    const { haut, gauche, bas, droite, graphique } = échelle;
    const { chartArea, scales } = chart;
    soit rotation = 0;
    soit maxWidth, titleX, titleY;
    hauteur constante = bas - haut;
    largeur constante = droite - gauche;
    si(scale.isHorizontal()) {
        titreX = _alignStartEnd(align, gauche, droite);
        si(isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            valeur constante = position[positionAxisID];
            titreY = échelles[positionAxisID].getPixelForValue(valeur) + hauteur - décalage;
        } sinon si(position === 'centre') {
            titreY = (chartArea.bottom + chartArea.top) / 2 + hauteur - décalage;
        } autre {
            titreY = décalageDepuisLeBord(échelle, position, décalage);
        }
        largeurmax = droite - gauche;
    } autre {
        si(isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            valeur constante = position[positionAxisID];
            titreX = échelles[positionAxisID].getPixelForValue(valeur) - largeur + décalage;
        } sinon si(position === 'centre') {
            titreX = (chartArea.left + chartArea.right) / 2 - largeur + décalage;
        } autre {
            titreX = décalageDepuisLeBord(échelle, position, décalage);
        }
        titreY = _alignStartEnd(align, bas, haut);
        rotation = position === 'gauche' ? -HALF_PI : HALF_PI;
    }
    retour {
        titreX,
            titreY,
            largeur maximale,
                rotation
    };
}
classe Scale étend Element {
    constructeur(cfg){
        super();
        this.id = cfg.id;
        this.type = cfg.type;
        this.options = undefined;
        this.ctx = cfg.ctx;
        this.chart = cfg.chart;
        this.top = indéfini;
        this.bottom = indéfini;
        this.left = indéfini;
        this.right = indéfini;
        this.width = indéfini;
        this.height = indéfini;
        this._margins = {
            gauche: 0,
            droite: 0,
            haut: 0,
            bas: 0
        };
        this.maxWidth = indéfini;
        this.maxHeight = indéfini;
        this.paddingTop = undefined;
        this.paddingBottom = indéfini;
        this.paddingLeft = indéfini;
        this.paddingRight = indéfini;
        this.axis = indéfini;
        this.labelRotation = non défini;
        this.min = indéfini;
        this.max = indéfini;
        this._range = indéfini;
        this.ticks = [];
        this._gridLineItems = null;
        this._labelItems = null;
        this._labelSizes = null;
        this._length = 0;
        this._maxLength = 0;
        this._longestTextCache = {};
        this._startPixel = indéfini;
        this._endPixel = indéfini;
        this._reversePixels = false;
        this._userMax = indéfini;
        this._userMin = indéfini;
        this._suggestedMax = indéfini;
        this._suggestedMin = indéfini;
        this._ticksLength = 0;
        this._borderValue = 0;
        this._cache = {};
        this._dataLimitsCached = false;
        this.$context = indéfini;
    }
    init(options) {
        this.options = options.setContext(this.getContext());
        this.axis = options.axis;
        this._userMin = this.parse(options.min);
        this._userMax = this.parse(options.max);
        this._suggestedMin = this.parse(options.suggestedMin);
        this._suggestedMax = this.parse(options.suggestedMax);
    }
    analyser(brut, index) {
        renvoyer brut;
    }
    obtenirUserBounds() {
        soit { _userMin, _userMax, _suggestedMin, _suggestedMax } = ceci;
        _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
        _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
        _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
        _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
        retour {
            min: finieOuParDéfaut(_userMin, _suggestedMin),
                max : finiOuParDéfaut(_userMax, _suggestedMax),
                    minDéfini : isNumberFinite(_userMin),
                        maxDefined : isNumberFinite(_userMax)
        };
    }
    obtenirMinMax(peutEmpiler) {
        let { min, max, minDefined, maxDefined } = this.getUserBounds();
        laisser la plage;
        si(minDefined && maxDefined) {
            retour {
                min,
                    max
            };
        }
        const metas = this.getMatchingVisibleMetas();
        pour(soit i = 0, ilen = metas.length; i < ilen; ++i) {
            plage = metas[i].controller.getMinMax(this, canStack);
            si(!minDefined) {
                min = Math.min(min, plage.min);
            }
            si(!maxDefined) {
                max = Math.max(max, plage.max);
            }
        }
        min = maxDéfini && min > max ? max : min;
        max = minDéfini && min > max ? min : max;
        retour {
            min: finiOuParDéfaut(min, finiOuParDéfaut(max, min)),
                max : finiOuParDéfaut(max, finiOuParDéfaut(min, max))
        };
    }
    obtenirPadding() {
        retour {
            gauche: this.paddingLeft || 0,
                haut : this.paddingTop || 0,
                    droite : this.paddingRight || 0,
                        fond : this.paddingBottom || 0
        };
    }
    obtenirTicks() {
        retourner this.ticks;
    }
    obtenirLabels() {
        const data = this.chart.data;
        retourner this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
    }
    getLabelItems(chartArea = this.chart.chartArea) {
        const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
        retourner les articles;
    }
    avantLayout() {
        this._cache = {};
        this._dataLimitsCached = false;
    }
    avantMiseÀJour() {
        rappel(this.options.beforeUpdate, [
            ce
        ]);
    }
 mettre à jour(largeurmax, hauteurmax, marges) {
        const { beginAtZero, grace, ticks: tickOpts } = this.options;
        const sampleSize = tickOpts.sampleSize;
        this.beforeUpdate();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins = Object.assign({
            gauche: 0,
            droite: 0,
            haut: 0,
            bas: 0
        }, marges);
        this.ticks = null;
        this._labelSizes = null;
        this._gridLineItems = null;
        this._labelItems = null;
        this.beforeSetDimensions();
        this.setDimensions();
        this.afterSetDimensions();
        this._maxLength = this.isHorizontal() ? this.width + margins.left + margins.right : this.height + margins.top + margins.bottom;
        si(!this._dataLimitsCached) {
            this.beforeDataLimits();
            this.déterminerDataLimits();
            this.afterDataLimits();
            this._range = _addGrace(this, grace, beginAtZero);
            this._dataLimitsCached = true;
        }
        this.beforeBuildTicks();
        this.ticks = this.buildTicks() || [];
        this.afterBuildTicks();
        const samplingEnabled = sampleSize < this.ticks.length;
        this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
        this.configure();
        this.beforeCalculateLabelRotation();
        this.calculateLabelRotation();
        this.afterCalculerRotationDeL'Étiquette();
        si(tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
            this.ticks = autoSkip(this, this.ticks);
            this._labelSizes = null;
            this.afterAutoSkip();
        }
        si(échantillonnageactivé) {
            this._convertTicksToLabels(this.ticks);
        }
        this.beforeFit();
        ceci.fit();
        this.afterFit();
        this.afterUpdate();
    }
    configurer() {
        soit reversePixels = this.options.reverse;
        soit startPixel, endPixel;
        si(this.isHorizontal()) {
            startPixel = this.left;
            endPixel = this.right;
        } autre {
            pixel de départ = this.top;
            finPixel = ceci.bas;
            reversePixels = !reversePixels;
        }
        this._startPixel = startPixel;
        this._endPixel = endPixel;
        this._reversePixels = reversePixels;
        this._length = endPixel - startPixel;
        this._alignToPixels = this.options.alignToPixels;
    }
    aprèsMiseÀJour() {
        rappel(this.options.afterUpdate, [
            ce
        ]);
    }
    avantSetDimensions() {
        rappel(this.options.beforeSetDimensions, [
            ce
        ]);
    }
    définirDimensions() {
        si(this.isHorizontal()) {
            this.width = this.maxWidth;
            this.left = 0;
            this.right = this.width;
        } autre {
            this.hauteur = this.hauteurmax;
            this.top = 0;
            this.bottom = this.height;
        }
        this.paddingLeft = 0;
        this.paddingTop = 0;
        this.paddingRight = 0;
        this.paddingBottom = 0;
    }
    aprèsSetDimensions() {
        rappel(this.options.afterSetDimensions, [
            ce
        ]);
    }
    _callHooks(nom) {
        this.chart.notifyPlugins(nom, this.getContext());
        rappel(this.options[nom], [
            ce
        ]);
    }
    avantDataLimits() {
        this._callHooks('beforeDataLimits');
    }
    déterminerDataLimits() { }
    après les limites de données() {
        this._callHooks('afterDataLimits');
    }
    avantBuildTicks() {
        this._callHooks('beforeBuildTicks');
    }
    construireTicks() {
        retour[];
    }
    aprèsBuildTicks() {
        this._callHooks('afterBuildTicks');
    }
    avant la conversion de l'étiquette en coche() {
    rappel(this.options.beforeTickToLabelConversion, [
        ce
    ]);
}
générerÉtiquettesDeCoches(cotes) {
    const tickOpts = this.options.ticks;
    laissez - moi, ilen, faire tic;
    pour(i = 0, ilen = ticks.length; i < ilen; i++) {
        tick = ticks[i];
        tick.label = callback(tickOpts.callback, [
            valeur de tick,
            je,
            tiques
        ], ce);
    }
}
    après la conversion de la coche en étiquette() {
    rappel(this.options.afterTickToLabelConversion, [
        ce
    ]);
}
avantCalculerRotationÉtiquette() {
    rappel(this.options.beforeCalculateLabelRotation, [
        ce
    ]);
}
calculerLabelRotation() {
    const options = this.options;
    const tickOpts = options.ticks;
    const numTicks = getTicksLimit(this.ticks.length, options.ticks.maxTicksLimit);
    const minRotation = tickOpts.minRotation || 0;
    const maxRotation = tickOpts.maxRotation;
        soit labelRotation = minRotation;
        laissez tickWidth, maxHeight, maxLabelDiagonal;
    si(!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
        this.labelRotation = minRotation;
        retour;
    }
    const labelSizes = this._getLabelSizes();
    const maxLabelWidth = labelSizes.widest.width;
    const maxLabelHeight = labelSizes.highest.height;
    const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
    tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
    si(largeurmaxLabel + 6 > largeurTick) {
        tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
        maxHeight = this.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
        maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
        labelRotation = toDegrees(Math.min(Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)), Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))));
        labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
    }
    this.labelRotation = labelRotation;
}
aprèsCalculerLabelRotation() {
    rappel(this.options.afterCalculateLabelRotation, [
        ce
    ]);
}
aprèsAutoSkip() { }
avantFit() {
    rappel(this.options.beforeFit, [
        ce
    ]);
}
ajuster() {
    const minSize = {
        largeur: 0,
        hauteur: 0
    };
    const { chart, options: { ticks: tickOpts, title: titleOpts, grid: gridOpts } } = this;
    const display = this._isVisible();
    const isHorizontal = this.isHorizontal();
    si(affichage) {
        const titleHeight = getTitleHeight(titleOpts, chart.options.font);
        si(estHorizontal) {
            minSize.width = this.maxWidth;
            minSize.height = getTickMarkLength(gridOpts) + titleHeight;
        } autre {
            taille_min.hauteur = ceci.hauteur_max;
            minSize.width = getTickMarkLength(gridOpts) + titleHeight;
        }
        si(tickOpts.display && this.ticks.length) {
            const { premier, dernier, plus large, plus haut } = this._getLabelSizes();
            const tickPadding = tickOpts.padding * 2;
            const angleRadians = toRadians(this.labelRotation);
            const cos = Math.cos(angleRadians);
            const sin = Math.sin(angleRadians);
            si(estHorizontal) {
                const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
                minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
            } autre {
                const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
                minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
            }
            this._calculatePadding(premier, dernier, sin, cos);
        }
    }
    this._handleMargins();
    si(estHorizontal) {
        this.width = this._length = chart.width - this._margins.left - this._margins.right;
        cette.hauteur = taille_min.hauteur;
    } autre {
        this.width = minSize.width;
        this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
    }
}
_calculerRemplissage(premier, dernier, sin, cos) {
    const { ticks: { align, padding }, position } = this.options;
    const isRotated = this.labelRotation !== 0;
    const labelsBelowTicks = position !== 'top' && this.axis === 'x';
    si(this.isHorizontal()) {
        const offsetLeft = this.getPixelForTick(0) - this.left;
        const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
            soit paddingLeft = 0;
            soit paddingRight = 0;
        si(estRoté) {
            si(étiquettesSousLesGraduations) {
                paddingLeft = cos * première.largeur;
                paddingRight = sin * dernière.hauteur;
            } autre {
                paddingLeft = sin * première.hauteur;
                paddingRight = cos * dernière.largeur;
            }
        } sinon si(alignement === 'début') {
            paddingRight = dernière.largeur;
        } sinon si(alignement === 'fin') {
            paddingLeft = première.largeur;
        } sinon si(alignement !== 'intérieur') {
            paddingLeft = première.largeur / 2;
            paddingRight = dernière.largeur / 2;
        }
        this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
        this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
    } autre {
            soit paddingTop = dernière.hauteur / 2;
            soit paddingBottom = première.hauteur / 2;
        si(alignement === 'début') {
            paddingTop = 0;
            paddingBottom = première.hauteur;
        } sinon si(alignement === 'fin') {
            paddingTop = dernière.hauteur;
            paddingBottom = 0;
        }
        this.paddingTop = paddingTop + padding;
        this.paddingBottom = paddingBottom + padding;
    }
}
_handleMargins() {
    si(this._margins) {
        this._margins.left = Math.max(this.paddingLeft, this._margins.left);
        this._margins.top = Math.max(this.paddingTop, this._margins.top);
        this._margins.right = Math.max(this.paddingRight, this._margins.right);
        this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
    }
}
aprèsFit() {
    rappel(this.options.afterFit, [
        ce
    ]);
}
estHorizontal() {
    const { axe, position } = this.options;
        retourner position === 'haut' || position === 'bas' || axe === 'x';
}
isFullSize() {
        renvoyer this.options.fullSize;
}
_convertTicksToLabels(ticks) {
    this.beforeTickToLabelConversion();
    this.generateTickLabels(ticks);
    laissez - moi, ilen;
    pour(i = 0, ilen = ticks.length; i < ilen; i++) {
        si(isNullOrUndef(ticks[i].label)) {
            ticks.splice(i, 1);
            ilen--;
            je--;
        }
    }
    this.afterTickToLabelConversion();
}
_getLabelSizes() {
    let labelSizes = this._labelSizes;
    si(!labelSizes) {
        const sampleSize = this.options.ticks.sampleSize;
        let ticks = this.ticks;
        si(taille de l'échantillon < ticks.length) {
                ticks = échantillon(ticks, taille_échantillon);
    }
    this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length, this.options.ticks.maxTicksLimit);
}
        renvoyer les tailles d'étiquettes ;
    }
_computeLabelSizes(ticks, longueur, maxTicksLimit) {
    const { ctx, _longestTextCache: caches } = this;
        largeurs constantes = [];
        hauteurs constantes = [];
    const incrément = Math.floor(longueur / getTicksLimit(longueur, maxTicksLimit));
        soit widestLabelSize = 0;
        soit highestLabelSize = 0;
        soit i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
    pour(i = 0; i < longueur; i += incrément) {
        étiquette = ticks[i].étiquette;
        tickFont = this._resolveTickFontOptions(i);
        ctx.font = fontString = tickFont.string;
        cache = caches[fontString] = caches[fontString] || {
            données: {},
            gc: []
        };
            hauteur de ligne = tickFont.hauteur de ligne;
        largeur = hauteur = 0;
        if (!isNullOrUndef(étiquette) && !isArray(étiquette)) {
            largeur = _measureText(ctx, cache.data, cache.gc, largeur, étiquette);
            hauteur = hauteur de ligne;
        } sinon si(isArray(label)) {
            pour(j = 0, jlen = label.length; j < jlen; ++j) {
                imbriquéLabel = label[j];
                si(!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
                    largeur = _measureText(ctx, cache.data, cache.gc, largeur, étiquette imbriquée);
                    hauteur += hauteur de ligne;
                }
            }
        }
        largeurs.push(largeur);
        hauteurs.pousser(hauteur);
        widestLabelSize = Math.max(largeur, widestLabelSize);
        tailleÉtiquetteLaPlusHaut = Math.max(hauteur, tailleÉtiquetteLaPlusHaut);
    }
    garbageCollect(caches, longueur);
    const widest = widths.indexOf(widestLabelSize);
    const highest = heights.indexOf(highestLabelSize);
    const valeurAt = (idx) => ({
        largeur: largeurs[idx] || 0,
        hauteur: hauteurs[idx] || 0
    });
        retour {
        premier: valeurAt(0),
            dernier : valeurÀ(longueur - 1),
                plus large: valeurAt(plus large),
                    plus haut: valeurAt(plus haut),
                        largeurs,
                        hauteurs
    };
}
obtenirLabelPourValeur(valeur) {
        valeur de retour;
}
obtenirPixelPourValeur(valeur, index) {
        renvoyer NaN;
}
obtenirValeurPourPixel(pixel) { }
obtenirPixelPourTick(index) {
    const ticks = this.ticks;
    si(index < 0 || index > ticks.length - 1) {
            renvoyer null;
    }
        retourner this.getPixelForValue(ticks[index].value);
}
obtenirPixelPourDécimal(décimal) {
    si(this._reversePixels) {
        décimal = 1 - décimal;
    }
    const pixel = this._startPixel + decimal * this._length;
    return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
}
obtenirDecimalPourPixel(pixel) {
    const décimal = (pixel - this._startPixel) / this._length;
        retourner this._reversePixels ? 1 - décimal : décimal;
}
obtenirPixelBase() {
        retourner this.getPixelForValue(this.getBaseValue());
}
obtenirValeurDeBase() {
    const { min, max } = ceci;
        retourner min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
}
obtenirContext(index) {
    const ticks = this.ticks || [];
    si(index >= 0 && index < ticks.length) {
        const tick = ticks[index];
            retourner tick.$context || (tick.$context = createTickContext(this.getContext(), index, tick));
    }
        retourner this.$context || (this.$context = createScaleContext(this.chart.getContext(), this));
}
_tickSize() {
    const optionTicks = this.options.ticks;
    const rot = toRadians(this.labelRotation);
    const cos = Math.abs(Math.cos(rot));
    const sin = Math.abs(Math.sin(rot));
    const labelSizes = this._getLabelSizes();
    const padding = optionTicks.autoSkipPadding || 0;
    const w = labelSizes ? labelSizes.widest.width + padding : 0;
    const h = labelSizes ? labelSizes.highest.height + padding : 0;
        retourner this.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
}
_isVisible() {
    const display = this.options.display;
    si(affichage !== 'auto') {
        retourner!!affichage;
    }
        retourner this.getMatchingVisibleMetas().length > 0;
}
_computeGridLineItems(chartArea) {
    const axe = this.axe;
    const graphique = this.graphique;
    const options = this.options;
    const { grille, position, bordure } = options;
    const décalage = grille.décalage;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const ticksLength = ticks.length + (offset ? 1 : 0);
    const tl = getTickMarkLength(grid);
    const items = [];
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = borderOpts.display ? borderOpts.width : 0;
    const axisHalfWidth = axisWidth / 2;
    const alignBorderValue = fonction(pixel) {
        renvoie _alignPixel(chart, pixel, axisWidth);
};
        soit borderValue, i, lineValue, alignedLineValue;
        soit tx1, ty1, tx2, ty2, x1, y1, x2, y2;
si(position === 'top') {
    borderValue = alignBorderValue(this.bottom);
    ty1 = this.bottom - tl;
    ty2 = valeur de la bordure - demi - largeur de l'axe ;
    y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
    y2 = chartArea.bottom;
} sinon si(position === 'bas') {
    borderValue = alignBorderValue(this.top);
    y1 = chartArea.top;
    y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
    ty1 = valeur de la bordure + demi - largeur de l'axe ;
    ty2 = this.top + tl;
} sinon si(position === 'gauche') {
    borderValue = alignBorderValue(this.right);
    tx1 = this.right - tl;
    tx2 = valeur de la bordure - demi - largeur de l'axe ;
    x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
    x2 = chartArea.right;
} sinon si(position === 'droite') {
    borderValue = alignBorderValue(this.left);
    x1 = chartArea.gauche;
    x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
    tx1 = valeur de bordure + demi - largeur de l'axe ;
    tx2 = this.left + tl;
} sinon si(axe === 'x') {
    si(position === 'centre') {
        borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
    } sinon si(isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
                valeur constante = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
    }
    y1 = chartArea.top;
    y2 = chartArea.bottom;
    ty1 = valeur de la bordure + demi - largeur de l'axe ;
    ty2 = ty1 + tl;
} sinon si(axe === 'y') {
    si(position === 'centre') {
        borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
    } sinon si(isObject(position)) {
        const positionAxisID = Object.keys(position)[0];
                valeur constante = position[positionAxisID];
        borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
    }
    tx1 = valeur de la bordure - demi - largeur de l'axe ;
    tx2 = tx1 - tl;
    x1 = chartArea.gauche;
    x2 = chartArea.right;
}
const limit = valeurOuParDéfaut(options.ticks.maxTicksLimit, ticksLength);
const étape = Math.max(1, Math.ceil(ticksLength / limite));
pour(i = 0; i < ticksLength; i += step) {
    const contexte = this.getContext(i);
    const optsAtIndex = grid.setContext(context);
    const optsAtIndexBorder = border.setContext(context);
    const largeurLigne = optsAtIndex.largeurLigne;
    const lineColor = optsAtIndex.color;
    const borderDash = optsAtIndexBorder.dash || [];
    const borderDashOffset = optsAtIndexBorder.dashOffset;
    const tickWidth = optsAtIndex.tickWidth;
    const tickColor = optsAtIndex.tickColor;
    const tickBorderDash = optsAtIndex.tickBorderDash || [];
    const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
    valeur_ligne = obtenirPixelPourLigneDeGrille(ceci, i, décalage);
    si(lineValue === undefined) {
        continuer;
    }
    valeurLigneAlignée = _alignPixel(graphique, valeurLigne, largeurLigne);
    si(estHorizontal) {
        tx1 = tx2 = x1 = x2 = valeurLigneAlignée;
    } autre {
        ty1 = ty2 = y1 = y2 = valeurLigneAlignée;
    }
    articles.push({
        TX1,
        ty1,
        TX2,
        ty2,
        x1,
        y1,
        x2,
        y2,
        largeur: largeur de ligne,
        couleur: lineColor,
        borderDash,
        décalage de bordure,
        largeur de tic,
        couleur de la coche,
        cocher Bordure Tiret,
        tickBorderDashOffset
    });
}
this._ticksLength = ticksLength;
this._borderValue = borderValue;
        retourner les articles;
    }
_computeLabelItems(chartArea) {
    const axe = this.axe;
    const options = this.options;
    const { position, ticks: optionTicks } = options;
    const isHorizontal = this.isHorizontal();
    const ticks = this.ticks;
    const { align, crossAlign, padding, mirror } = optionTicks;
    const tl = getTickMarkLength(options.grid);
    const tickAndPadding = tl + rembourrage;
    const hTickAndPadding = miroir ? -padding : tickAndPadding;
    const rotation = -toRadians(this.labelRotation);
    const items = [];
        soit i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
        soit textBaseline = 'milieu';
    si(position === 'top') {
        y = this.bottom - hTickAndPadding;
        textAlign = this._getXAxisLabelAlignment();
    } sinon si(position === 'bas') {
        y = this.top + hTickAndPadding;
        textAlign = this._getXAxisLabelAlignment();
    } sinon si(position === 'gauche') {
        const ret = this._getYAxisLabelAlignment(tl);
        textAlign = ret.textAlign;
        x = ret.x;
    } sinon si(position === 'droite') {
        const ret = this._getYAxisLabelAlignment(tl);
        textAlign = ret.textAlign;
        x = ret.x;
    } sinon si(axe === 'x') {
        si(position === 'centre') {
            y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
        } sinon si(isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
                valeur constante = position[positionAxisID];
            y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
        }
        textAlign = this._getXAxisLabelAlignment();
    } sinon si(axe === 'y') {
        si(position === 'centre') {
            x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
        } sinon si(isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
                valeur constante = position[positionAxisID];
            x = this.chart.scales[positionAxisID].getPixelForValue(value);
        }
        textAlign = this._getYAxisLabelAlignment(tl).textAlign;
    }
    si(axe === 'y') {
        si(alignement === 'début') {
            textBaseline = 'haut';
        } sinon si(alignement === 'fin') {
            textBaseline = 'bas';
        }
    }
    const labelSizes = this._getLabelSizes();
    pour(i = 0, ilen = ticks.length; i < ilen; ++i) {
        tick = ticks[i];
        étiquette = coche.étiquette;
        const optsAtIndex = optionTicks.setContext(this.getContext(i));
        pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
        police = this._resolveTickFontOptions(i);
            hauteur de ligne = police.hauteur de ligne;
        lineCount = isArray(label) ? label.length : 1;
        const demi-compteur = nombre de lignes / 2;
        const couleur = optsAtIndex.couleur;
        const StrokeColor = optsAtIndex.textStrokeColor;
        const StrokeWidth = optsAtIndex.textStrokeWidth;
            laissez tickTextAlign = textAlign;
        si(estHorizontal) {
            x = pixel;
            si(textAlign === 'inner') {
                si(i === ilen - 1) {
                    tickTextAlign = !this.options.reverse ? 'right' : 'left';
                } sinon si(i === 0) {
                    tickTextAlign = !this.options.reverse ? 'gauche' : 'droite';
                } autre {
                    tickTextAlign = 'centre';
                }
            }
            si(position === 'top') {
                si(crossAlign === 'near' || rotation !== 0) {
                    textOffset = -lineCount * lineHeight + lineHeight / 2;
                } sinon si(crossAlign === 'center') {
                    textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
                } autre {
                    textOffset = -labelSizes.highest.height + lineHeight / 2;
                }
            } autre {
                si(crossAlign === 'near' || rotation !== 0) {
                        Décalage du texte = hauteur de ligne / 2;
                } sinon si(crossAlign === 'center') {
                    textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
                } autre {
                    textOffset = labelSizes.highest.height - lineCount * lineHeight;
                }
            }
            si(miroir) {
                textOffset *= -1;
            }
            si(rotation !== 0 && !optsAtIndex.showLabelBackdrop) {
                x += hauteurLigne / 2 * Math.sin(rotation);
            }
        } autre {
            y = pixel;
            textOffset = (1 - lineCount) * lineHeight / 2;
        }
            laisser l'arrière-plan;
        si(optsAtIndex.showLabelBackdrop) {
            const labelPadding = toPadding(optsAtIndex.backdropPadding);
            const hauteur = labelSizes.heights[i];
            const largeur = labelSizes.widths[i];
                soit top = textOffset - labelPadding.top;
                soit gauche = 0 - labelPadding.gauche;
            switch (textBaseline) {
                    cas 'milieu' :
            haut -= hauteur / 2;
            casser;
                    cas 'bas' :
            haut -= hauteur;
            casser;
        }
        switch (textAlign) {
                    cas 'centre' :
        gauche -= largeur / 2;
        casser;
                    cas 'droite' :
        gauche -= largeur;
        casser;
                    cas 'inner' :
        si(i === ilen - 1) {
            gauche -= largeur;
        } sinon si(i > 0) {
            gauche -= largeur / 2;
        }
        casser;
    }
    arrière - plan = {
        gauche,
            haut,
            largeur : largeur + marge intérieure de l’étiquette.largeur,
                hauteur : hauteur + labelPadding.hauteur,
                    couleur: optsAtIndex.backdropColor
    };
}
articles.push({
    étiquette,
    fonte,
    décalage du texte,
    options: {
        rotation,
        couleur,
        couleur du trait,
        largeur_trait,
        textAlign: tickTextAlign,
        ligne de base du texte,
        traduction: [
            x,
            y
        ],
        arrière- plan
}
            });
        }
        retourner les articles;
    }
_getXAxisLabelAlignment() {
    const { position, ticks } = this.options;
    const rotation = -toRadians(this.labelRotation);
    si(rotation) {
        return position === 'top' ? 'left' : 'right';
    }
    let align = 'center';
    if (ticks.align === 'start') {
        align = 'left';
    } else if (ticks.align === 'end') {
        align = 'right';
    } else if (ticks.align === 'inner') {
        align = 'inner';
    }
    return align;
}
_getYAxisLabelAlignment(tl) {
    const { position, ticks: { crossAlign, mirror, padding } } = this.options;
    const labelSizes = this._getLabelSizes();
    const tickAndPadding = tl + padding;
    const widest = labelSizes.widest.width;
    let textAlign;
    let x;
    if (position === 'left') {
        if (mirror) {
            x = this.right + padding;
            if (crossAlign === 'near') {
                textAlign = 'left';
            } else if (crossAlign === 'center') {
                textAlign = 'center';
                x += widest / 2;
            } else {
                textAlign = 'right';
                x += widest;
            }
        } else {
            x = this.right - tickAndPadding;
            if (crossAlign === 'near') {
                textAlign = 'right';
            } else if (crossAlign === 'center') {
                textAlign = 'center';
                x -= widest / 2;
            } else {
                textAlign = 'left';
                x = this.left;
            }
        }
    } else if (position === 'right') {
        if (mirror) {
            x = this.left + padding;
            if (crossAlign === 'near') {
                textAlign = 'right';
            } else if (crossAlign === 'center') {
                textAlign = 'center';
                x -= widest / 2;
            } else {
                textAlign = 'left';
                x -= widest;
            }
        } else {
            x = this.left + tickAndPadding;
            if (crossAlign === 'near') {
                textAlign = 'left';
            } else if (crossAlign === 'center') {
                textAlign = 'center';
                x += widest / 2;
            } else {
                textAlign = 'right';
                x = this.right;
            }
        }
    } else {
        textAlign = 'right';
    }
    return {
        textAlign,
        x
    };
}
_computeLabelArea() {
    if (this.options.ticks.mirror) {
        return;
    }
    const chart = this.chart;
    const position = this.options.position;
    if (position === 'left' || position === 'right') {
        return {
            top: 0,
            left: this.left,
            bottom: chart.height,
            right: this.right
        };
    }
    if (position === 'top' || position === 'bottom') {
        return {
            top: this.top,
            left: 0,
            bottom: this.bottom,
            right: chart.width
        };
    }
}
drawBackground() {
    const { ctx, options: { backgroundColor }, left, top, width, height } = this;
    if (backgroundColor) {
        ctx.save();
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(left, top, width, height);
        ctx.restore();
    }
}
getLineWidthForValue(value) {
    const grid = this.options.grid;
    if (!this._isVisible() || !grid.display) {
        return 0;
    }
    const ticks = this.ticks;
    const index = ticks.findIndex((t) => t.value === value);
    if (index >= 0) {
        const opts = grid.setContext(this.getContext(index));
        return opts.lineWidth;
    }
    return 0;
}
drawGrid(chartArea) {
    const grid = this.options.grid;
    const ctx = this.ctx;
    const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
    let i, ilen;
    const drawLine = (p1, p2, style) => {
        if (!style.width || !style.color) {
            return;
        }
        ctx.save();
        ctx.lineWidth = style.width;
        ctx.strokeStyle = style.color;
        ctx.setLineDash(style.borderDash || []);
        ctx.lineDashOffset = style.borderDashOffset;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
    };
    if (grid.display) {
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            const item = items[i];
            if (grid.drawOnChartArea) {
                drawLine({
                    x: item.x1,
                    y: item.y1
                }, {
                    x: item.x2,
                    y: item.y2
                }, item);
            }
            if (grid.drawTicks) {
                drawLine({
                    x: item.tx1,
                    y: item.ty1
                }, {
                    x: item.tx2,
                    y: item.ty2
                }, {
                    color: item.tickColor,
                    width: item.tickWidth,
                    borderDash: item.tickBorderDash,
                    borderDashOffset: item.tickBorderDashOffset
                });
            }
        }
    }
}
drawBorder() {
    const { chart, ctx, options: { border, grid } } = this;
    const borderOpts = border.setContext(this.getContext());
    const axisWidth = border.display ? borderOpts.width : 0;
    if (!axisWidth) {
        return;
    }
    const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
    const borderValue = this._borderValue;
    let x1, x2, y1, y2;
    if (this.isHorizontal()) {
        x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
        x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
        y1 = y2 = borderValue;
    } else {
        y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
        y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
        x1 = x2 = borderValue;
    }
    ctx.save();
    ctx.lineWidth = borderOpts.width;
    ctx.strokeStyle = borderOpts.color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}
drawLabels(chartArea) {
    const optionTicks = this.options.ticks;
    if (!optionTicks.display) {
        return;
    }
    const ctx = this.ctx;
    const area = this._computeLabelArea();
    if (area) {
        clipArea(ctx, area);
    }
    const items = this.getLabelItems(chartArea);
    for (const item of items) {
        const renderTextOptions = item.options;
        const tickFont = item.font;
        const label = item.label;
        const y = item.textOffset;
        renderText(ctx, label, 0, y, tickFont, renderTextOptions);
    }
    if (area) {
        unclipArea(ctx);
    }
}
drawTitle() {
    const { ctx, options: { position, title, reverse } } = this;
    if (!title.display) {
        return;
    }
    const font = toFont(title.font);
    const padding = toPadding(title.padding);
    const align = title.align;
    let offset = font.lineHeight / 2;
    if (position === 'bottom' || position === 'center' || isObject(position)) {
        offset += padding.bottom;
        if (isArray(title.text)) {
            offset += font.lineHeight * (title.text.length - 1);
        }
    } else {
        offset += padding.top;
    }
    const { titleX, titleY, maxWidth, rotation } = titleArgs(this, offset, position, align);
    renderText(ctx, title.text, 0, 0, font, {
        color: title.color,
        maxWidth,
        rotation,
        textAlign: titleAlign(align, position, reverse),
        textBaseline: 'middle',
        translation: [
            titleX,
            titleY
        ]
    });
}
draw(chartArea) {
    if (!this._isVisible()) {
        return;
    }
    this.drawBackground();
    this.drawGrid(chartArea);
    this.drawBorder();
    this.drawTitle();
    this.drawLabels(chartArea);
}
_layers() {
    const opts = this.options;
    const tz = opts.ticks && opts.ticks.z || 0;
    const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
    const bz = valueOrDefault(opts.border && opts.border.z, 0);
    if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
        return [
            {
                z: tz,
                draw: (chartArea) => {
                    this.draw(chartArea);
                }
            }
        ];
    }
    return [
        {
            z: gz,
            draw: (chartArea) => {
                this.drawBackground();
                this.drawGrid(chartArea);
                this.drawTitle();
            }
        },
        {
            z: bz,
            draw: () => {
                this.drawBorder();
            }
        },
        {
            z: tz,
            draw: (chartArea) => {
                this.drawLabels(chartArea);
            }
        }
    ];
}
getMatchingVisibleMetas(type) {
    const metas = this.chart.getSortedVisibleDatasetMetas();
    const axisID = this.axis + 'AxisID';
    const result = [];
    let i, ilen;
    for (i = 0, ilen = metas.length; i < ilen; ++i) {
        const meta = metas[i];
        if (meta[axisID] === this.id && (!type || meta.type === type)) {
            result.push(meta);
        }
    }
    return result;
}
_resolveTickFontOptions(index) {
    const opts = this.options.ticks.setContext(this.getContext(index));
    return toFont(opts.font);
}
_maxDigits() {
    const fontSize = this._resolveTickFontOptions(0).lineHeight;
    return (this.isHorizontal() ? this.width : this.height) / fontSize;
}
}

class TypedRegistry {
    constructor(type, scope, override) {
        this.type = type;
        this.scope = scope;
        this.override = override;
        this.items = Object.create(null);
    }
    isForType(type) {
        return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
    }
    register(item) {
        const proto = Object.getPrototypeOf(item);
        let parentScope;
        if (isIChartComponent(proto)) {
            parentScope = this.register(proto);
        }
        const items = this.items;
        const id = item.id;
        const scope = this.scope + '.' + id;
        if (!id) {
            throw new Error('class does not have id: ' + item);
        }
        if (id in items) {
            return scope;
        }
        items[id] = item;
        registerDefaults(item, scope, parentScope);
        if (this.override) {
            defaults.override(item.id, item.overrides);
        }
        return scope;
    }
    get(id) {
        return this.items[id];
    }
    unregister(item) {
        const items = this.items;
        const id = item.id;
        const scope = this.scope;
        if (id in items) {
            delete items[id];
        }
        if (scope && id in defaults[scope]) {
            delete defaults[scope][id];
            if (this.override) {
                delete overrides[id];
            }
        }
    }
}
function registerDefaults(item, scope, parentScope) {
    const itemDefaults = merge(Object.create(null), [
        parentScope ? defaults.get(parentScope) : {},
        defaults.get(scope),
        item.defaults
    ]);
    defaults.set(scope, itemDefaults);
    if (item.defaultRoutes) {
        routeDefaults(scope, item.defaultRoutes);
    }
    if (item.descriptors) {
        defaults.describe(scope, item.descriptors);
    }
}
function routeDefaults(scope, routes) {
    Object.keys(routes).forEach((property) => {
        const propertyParts = property.split('.');
        const sourceName = propertyParts.pop();
        const sourceScope = [
            scope
        ].concat(propertyParts).join('.');
        const parts = routes[property].split('.');
        const targetName = parts.pop();
        const targetScope = parts.join('.');
        defaults.route(sourceScope, sourceName, targetScope, targetName);
    });
}
function isIChartComponent(proto) {
    return 'id' in proto && 'defaults' in proto;
}

class Registry {
    constructor() {
        this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
        this.elements = new TypedRegistry(Element, 'elements');
        this.plugins = new TypedRegistry(Object, 'plugins');
        this.scales = new TypedRegistry(Scale, 'scales');
        this._typedRegistries = [
            this.controllers,
            this.scales,
            this.elements
        ];
    }
    add(...args) {
        this._each('register', args);
    }
    remove(...args) {
        this._each('unregister', args);
    }
    addControllers(...args) {
        this._each('register', args, this.controllers);
    }
    addElements(...args) {
        this._each('register', args, this.elements);
    }
    addPlugins(...args) {
        this._each('register', args, this.plugins);
    }
    addScales(...args) {
        this._each('register', args, this.scales);
    }
    getController(id) {
        return this._get(id, this.controllers, 'controller');
    }
    getElement(id) {
        return this._get(id, this.elements, 'element');
    }
    getPlugin(id) {
        return this._get(id, this.plugins, 'plugin');
    }
    getScale(id) {
        return this._get(id, this.scales, 'scale');
    }
    removeControllers(...args) {
        this._each('unregister', args, this.controllers);
    }
    removeElements(...args) {
        this._each('unregister', args, this.elements);
    }
    removePlugins(...args) {
        this._each('unregister', args, this.plugins);
    }
    removeScales(...args) {
        this._each('unregister', args, this.scales);
    }
    _each(method, args, typedRegistry) {
        [
            ...args
        ].forEach((arg) => {
            const reg = typedRegistry || this._getRegistryForType(arg);
            if (typedRegistry || reg.isForType(arg) || reg === this.plugins && arg.id) {
                this._exec(method, reg, arg);
            } else {
                each(arg, (item) => {
                    const itemReg = typedRegistry || this._getRegistryForType(item);
                    this._exec(method, itemReg, item);
                });
            }
        });
    }
    _exec(method, registry, component) {
        const camelMethod = _capitalize(method);
        callback(component['before' + camelMethod], [], component);
        registry[method](component);
        callback(component['after' + camelMethod], [], component);
    }
    _getRegistryForType(type) {
        for (let i = 0; i < this._typedRegistries.length; i++) {
            const reg = this._typedRegistries[i];
            if (reg.isForType(type)) {
                return reg;
            }
        }
        return this.plugins;
    }
    _get(id, typedRegistry, type) {
        const item = typedRegistry.get(id);
        if (item === undefined) {
            throw new Error('"' + id + '" is not a registered ' + type + '.');
        }
        return item;
    }
}
var registry = /* #__PURE__ */ new Registry();

class PluginService {
    constructor() {
        this._init = undefined;
    }
    notify(chart, hook, args, filter) {
        if (hook === 'beforeInit') {
            this._init = this._createDescriptors(chart, true);
            this._notify(this._init, chart, 'install');
        }
        if (this._init === undefined) {
            return;
        }
        const descriptors = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
        const result = this._notify(descriptors, chart, hook, args);
        if (hook === 'afterDestroy') {
            this._notify(descriptors, chart, 'stop');
            this._notify(this._init, chart, 'uninstall');
            this._init = undefined;
        }
        return result;
    }
    _notify(descriptors, chart, hook, args) {
        args = args || {};
        for (const descriptor of descriptors) {
            const plugin = descriptor.plugin;
            const method = plugin[hook];
            const params = [
                chart,
                args,
                descriptor.options
            ];
            if (callback(method, params, plugin) === false && args.cancelable) {
                return false;
            }
        }
        return true;
    }
    invalidate() {
        if (!isNullOrUndef(this._cache)) {
            this._oldCache = this._cache;
            this._cache = undefined;
        }
    }
    _descriptors(chart) {
        if (this._cache) {
            return this._cache;
        }
        const descriptors = this._cache = this._createDescriptors(chart);
        this._notifyStateChanges(chart);
        return descriptors;
    }
    _createDescriptors(chart, all) {
        const config = chart && chart.config;
        const options = valueOrDefault(config.options && config.options.plugins, {});
        const plugins = allPlugins(config);
        return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
    }
    _notifyStateChanges(chart) {
        const previousDescriptors = this._oldCache || [];
        const descriptors = this._cache;
        const diff = (a, b) => a.filter((x) => !b.some((y) => x.plugin.id === y.plugin.id));
        this._notify(diff(previousDescriptors, descriptors), chart, 'stop');
        this._notify(diff(descriptors, previousDescriptors), chart, 'start');
    }
}
function allPlugins(config) {
    const localIds = {};
    const plugins = [];
    const keys = Object.keys(registry.plugins.items);
    for (let i = 0; i < keys.length; i++) {
        plugins.push(registry.getPlugin(keys[i]));
    }
    const local = config.plugins || [];
    for (let i = 0; i < local.length; i++) {
        const plugin = local[i];
        if (plugins.indexOf(plugin) === -1) {
            plugins.push(plugin);
            localIds[plugin.id] = true;
        }
    }
    return {
        plugins,
        localIds
    };
}
function getOpts(options, all) {
    if (!all && options === false) {
        return null;
    }
    if (options === true) {
        return {};
    }
    return options;
}
function createDescriptors(chart, { plugins, localIds }, options, all) {
    const result = [];
    const context = chart.getContext();
    for (const plugin of plugins) {
        const id = plugin.id;
        const opts = getOpts(options[id], all);
        if (opts === null) {
            continue;
        }
        result.push({
            plugin,
            options: pluginOpts(chart.config, {
                plugin,
                local: localIds[id]
            }, opts, context)
        });
    }
    return result;
}
function pluginOpts(config, { plugin, local }, opts, context) {
    const keys = config.pluginScopeKeys(plugin);
    const scopes = config.getOptionScopes(opts, keys);
    if (local && plugin.defaults) {
        scopes.push(plugin.defaults);
    }
    return config.createResolver(scopes, context, [
        ''
    ], {
        scriptable: false,
        indexable: false,
        allKeys: true
    });
}

function getIndexAxis(type, options) {
    const datasetDefaults = defaults.datasets[type] || {};
    const datasetOptions = (options.datasets || {})[type] || {};
    return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
}
function getAxisFromDefaultScaleID(id, indexAxis) {
    let axis = id;
    if (id === '_index_') {
        axis = indexAxis;
    } else if (id === '_value_') {
        axis = indexAxis === 'x' ? 'y' : 'x';
    }
    return axis;
}
function getDefaultScaleIDFromAxis(axis, indexAxis) {
    return axis === indexAxis ? '_index_' : '_value_';
}
function idMatchesAxis(id) {
    if (id === 'x' || id === 'y' || id === 'r') {
        return id;
    }
}
function axisFromPosition(position) {
    if (position === 'top' || position === 'bottom') {
        return 'x';
    }
    if (position === 'left' || position === 'right') {
        return 'y';
    }
}
function determineAxis(id, ...scaleOptions) {
    if (idMatchesAxis(id)) {
        return id;
    }
    for (const opts of scaleOptions) {
        const axis = opts.axis || axisFromPosition(opts.position) || id.length > 1 && idMatchesAxis(id[0].toLowerCase());
        if (axis) {
            return axis;
        }
    }
    throw new Error(`Cannot determine type of '${id}' axis. Please provide 'axis' or 'position' option.`);
}
function getAxisFromDataset(id, axis, dataset) {
    if (dataset[axis + 'AxisID'] === id) {
        return {
            axis
        };
    }
}
function retrieveAxisFromDatasets(id, config) {
    if (config.data && config.data.datasets) {
        const boundDs = config.data.datasets.filter((d) => d.xAxisID === id || d.yAxisID === id);
        if (boundDs.length) {
            return getAxisFromDataset(id, 'x', boundDs[0]) || getAxisFromDataset(id, 'y', boundDs[0]);
        }
    }
    return {};
}
function mergeScaleConfig(config, options) {
    const chartDefaults = overrides[config.type] || {
        scales: {}
    };
    const configScales = options.scales || {};
    const chartIndexAxis = getIndexAxis(config.type, options);
    const scales = Object.create(null);
    Object.keys(configScales).forEach((id) => {
        const scaleConf = configScales[id];
        if (!isObject(scaleConf)) {
            return console.error(`Invalid scale configuration for scale: ${id}`);
        }
        if (scaleConf._proxy) {
            return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
        }
        const axis = determineAxis(id, scaleConf, retrieveAxisFromDatasets(id, config), defaults.scales[scaleConf.type]);
        const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
        const defaultScaleOptions = chartDefaults.scales || {};
        scales[id] = mergeIf(Object.create(null), [
            {
                axis
            },
            scaleConf,
            defaultScaleOptions[axis],
            defaultScaleOptions[defaultId]
        ]);
    });
    config.data.datasets.forEach((dataset) => {
        const type = dataset.type || config.type;
        const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
        const datasetDefaults = overrides[type] || {};
        const defaultScaleOptions = datasetDefaults.scales || {};
        Object.keys(defaultScaleOptions).forEach((defaultID) => {
            const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
            const id = dataset[axis + 'AxisID'] || axis;
            scales[id] = scales[id] || Object.create(null);
            mergeIf(scales[id], [
                {
                    axis
                },
                configScales[id],
                defaultScaleOptions[defaultID]
            ]);
        });
    });
    Object.keys(scales).forEach((key) => {
        const scale = scales[key];
        mergeIf(scale, [
            defaults.scales[scale.type],
            defaults.scale
        ]);
    });
    return scales;
}
function initOptions(config) {
    const options = config.options || (config.options = {});
    options.plugins = valueOrDefault(options.plugins, {});
    options.scales = mergeScaleConfig(config, options);
}
function initData(data) {
    data = data || {};
    data.datasets = data.datasets || [];
    data.labels = data.labels || [];
    return data;
}
function initConfig(config) {
    config = config || {};
    config.data = initData(config.data);
    initOptions(config);
    return config;
}
const keyCache = new Map();
const keysCached = new Set();
function cachedKeys(cacheKey, generate) {
    let keys = keyCache.get(cacheKey);
    if (!keys) {
        keys = generate();
        keyCache.set(cacheKey, keys);
        keysCached.add(keys);
    }
    return keys;
}
const addIfFound = (set, obj, key) => {
    const opts = resolveObjectKey(obj, key);
    if (opts !== undefined) {
        set.add(opts);
    }
};
class Config {
    constructor(config) {
        this._config = initConfig(config);
        this._scopeCache = new Map();
        this._resolverCache = new Map();
    }
    get platform() {
        return this._config.platform;
    }
    get type() {
        return this._config.type;
    }
    set type(type) {
        this._config.type = type;
    }
    get data() {
        return this._config.data;
    }
    set data(data) {
        this._config.data = initData(data);
    }
    get options() {
        return this._config.options;
    }
    set options(options) {
        this._config.options = options;
    }
    get plugins() {
        return this._config.plugins;
    }
    update() {
        const config = this._config;
        this.clearCache();
        initOptions(config);
    }
    clearCache() {
        this._scopeCache.clear();
        this._resolverCache.clear();
    }
    datasetScopeKeys(datasetType) {
        return cachedKeys(datasetType, () => [
            [
                `datasets.${datasetType}`,
                ''
            ]
        ]);
    }
    datasetAnimationScopeKeys(datasetType, transition) {
        return cachedKeys(`${datasetType}.transition.${transition}`, () => [
            [
                `datasets.${datasetType}.transitions.${transition}`,
                `transitions.${transition}`
            ],
            [
                `datasets.${datasetType}`,
                ''
            ]
        ]);
    }
    datasetElementScopeKeys(datasetType, elementType) {
        return cachedKeys(`${datasetType}-${elementType}`, () => [
            [
                `datasets.${datasetType}.elements.${elementType}`,
                `datasets.${datasetType}`,
                `elements.${elementType}`,
                ''
            ]
        ]);
    }
    pluginScopeKeys(plugin) {
        const id = plugin.id;
        const type = this.type;
        return cachedKeys(`${type}-plugin-${id}`, () => [
            [
                `plugins.${id}`,
                ...plugin.additionalOptionScopes || []
            ]
        ]);
    }
    _cachedScopes(mainScope, resetCache) {
        const _scopeCache = this._scopeCache;
        let cache = _scopeCache.get(mainScope);
        if (!cache || resetCache) {
            cache = new Map();
            _scopeCache.set(mainScope, cache);
        }
        return cache;
    }
    getOptionScopes(mainScope, keyLists, resetCache) {
        const { options, type } = this;
        const cache = this._cachedScopes(mainScope, resetCache);
        const cached = cache.get(keyLists);
        if (cached) {
            return cached;
        }
        const scopes = new Set();
        keyLists.forEach((keys) => {
            if (mainScope) {
                scopes.add(mainScope);
                keys.forEach((key) => addIfFound(scopes, mainScope, key));
            }
            keys.forEach((key) => addIfFound(scopes, options, key));
            keys.forEach((key) => addIfFound(scopes, overrides[type] || {}, key));
            keys.forEach((key) => addIfFound(scopes, defaults, key));
            keys.forEach((key) => addIfFound(scopes, descriptors, key));
        });
        const array = Array.from(scopes);
        if (array.length === 0) {
            array.push(Object.create(null));
        }
        if (keysCached.has(keyLists)) {
            cache.set(keyLists, array);
        }
        return array;
    }
    chartOptionScopes() {
        const { options, type } = this;
        return [
            options,
            overrides[type] || {},
            defaults.datasets[type] || {},
            {
                type
            },
            defaults,
            descriptors
        ];
    }
    resolveNamedOptions(scopes, names, context, prefixes = [
        ''
    ]) {
        const result = {
            $shared: true
        };
        const { resolver, subPrefixes } = getResolver(this._resolverCache, scopes, prefixes);
        let options = resolver;
        if (needContext(resolver, names)) {
            result.$shared = false;
            context = isFunction(context) ? context() : context;
            const subResolver = this.createResolver(scopes, context, subPrefixes);
            options = _attachContext(resolver, context, subResolver);
        }
        for (const prop of names) {
            result[prop] = options[prop];
        }
        return result;
    }
    createResolver(scopes, context, prefixes = [
        ''
    ], descriptorDefaults) {
        const { resolver } = getResolver(this._resolverCache, scopes, prefixes);
        return isObject(context) ? _attachContext(resolver, context, undefined, descriptorDefaults) : resolver;
    }
}
function getResolver(resolverCache, scopes, prefixes) {
    let cache = resolverCache.get(scopes);
    if (!cache) {
        cache = new Map();
        resolverCache.set(scopes, cache);
    }
    const cacheKey = prefixes.join();
    let cached = cache.get(cacheKey);
    if (!cached) {
        const resolver = _createResolver(scopes, prefixes);
        cached = {
            resolver,
            subPrefixes: prefixes.filter((p) => !p.toLowerCase().includes('hover'))
        };
        cache.set(cacheKey, cached);
    }
    return cached;
}
const hasFunction = (value) => isObject(value) && Object.getOwnPropertyNames(value).some((key) => isFunction(value[key]));
function needContext(proxy, names) {
    const { isScriptable, isIndexable } = _descriptors(proxy);
    for (const prop of names) {
        const scriptable = isScriptable(prop);
        const indexable = isIndexable(prop);
        const value = (indexable || scriptable) && proxy[prop];
        if (scriptable && (isFunction(value) || hasFunction(value)) || indexable && isArray(value)) {
            return true;
        }
    }
    return false;
}

var version = "4.5.1";

const KNOWN_POSITIONS = [
    'top',
    'bottom',
    'left',
    'right',
    'chartArea'
];
function positionIsHorizontal(position, axis) {
    return position === 'top' || position === 'bottom' || KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x';
}
function compare2Level(l1, l2) {
    return function (a, b) {
        return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
    };
}
function onAnimationsComplete(context) {
    const chart = context.chart;
    const animationOptions = chart.options.animation;
    chart.notifyPlugins('afterRender');
    callback(animationOptions && animationOptions.onComplete, [
        context
    ], chart);
}
function onAnimationProgress(context) {
    const chart = context.chart;
    const animationOptions = chart.options.animation;
    callback(animationOptions && animationOptions.onProgress, [
        context
    ], chart);
}
function getCanvas(item) {
    if (_isDomSupported() && typeof item === 'string') {
        item = document.getElementById(item);
    } else if (item && item.length) {
        item = item[0];
    }
    if (item && item.canvas) {
        item = item.canvas;
    }
    return item;
}
const instances = {};
const getChart = (key) => {
    const canvas = getCanvas(key);
    return Object.values(instances).filter((c) => c.canvas === canvas).pop();
};
function moveNumericKeys(obj, start, move) {
    const keys = Object.keys(obj);
    for (const key of keys) {
        const intKey = +key;
        if (intKey >= start) {
            const value = obj[key];
            delete obj[key];
            if (move > 0 || intKey > start) {
                obj[intKey + move] = value;
            }
        }
    }
}
function determineLastEvent(e, lastEvent, inChartArea, isClick) {
    if (!inChartArea || e.type === 'mouseout') {
        return null;
    }
    if (isClick) {
        return lastEvent;
    }
    return e;
}
class Chart {
    static defaults = defaults;
    static instances = instances;
    static overrides = overrides;
    static registry = registry;
    static version = version;
    static getChart = getChart;
    static register(...items) {
        registry.add(...items);
        invalidatePlugins();
    }
    static unregister(...items) {
        registry.remove(...items);
        invalidatePlugins();
    }
    constructor(item, userConfig) {
        const config = this.config = new Config(userConfig);
        const initialCanvas = getCanvas(item);
        const existingChart = getChart(initialCanvas);
        if (existingChart) {
            throw new Error('Canvas is already in use. Chart with ID \'' + existingChart.id + '\'' + ' must be destroyed before the canvas with ID \'' + existingChart.canvas.id + '\' can be reused.');
        }
        const options = config.createResolver(config.chartOptionScopes(), this.getContext());
        this.platform = new (config.platform || _detectPlatform(initialCanvas))();
        this.platform.updateConfig(config);
        const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
        const canvas = context && context.canvas;
        const height = canvas && canvas.height;
        const width = canvas && canvas.width;
        this.id = uid();
        this.ctx = context;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this._options = options;
        this._aspectRatio = this.aspectRatio;
        this._layers = [];
        this._metasets = [];
        this._stacks = undefined;
        this.boxes = [];
        this.currentDevicePixelRatio = undefined;
        this.chartArea = undefined;
        this._active = [];
        this._lastEvent = undefined;
        this._listeners = {};
        this._responsiveListeners = undefined;
        this._sortedMetasets = [];
        this.scales = {};
        this._plugins = new PluginService();
        this.$proxies = {};
        this._hiddenIndices = {};
        this.attached = false;
        this._animationsDisabled = undefined;
        this.$context = undefined;
        this._doResize = debounce((mode) => this.update(mode), options.resizeDelay || 0);
        this._dataChanges = [];
        instances[this.id] = this;
        if (!context || !canvas) {
            console.error("Failed to create chart: can't acquire context from the given item");
            return;
        }
        animator.listen(this, 'complete', onAnimationsComplete);
        animator.listen(this, 'progress', onAnimationProgress);
        this._initialize();
        if (this.attached) {
            this.update();
        }
    }
    get aspectRatio() {
        const { options: { aspectRatio, maintainAspectRatio }, width, height, _aspectRatio } = this;
        if (!isNullOrUndef(aspectRatio)) {
            return aspectRatio;
        }
        if (maintainAspectRatio && _aspectRatio) {
            return _aspectRatio;
        }
        return height ? width / height : null;
    }
    get data() {
        return this.config.data;
    }
    set data(data) {
        this.config.data = data;
    }
    get options() {
        return this._options;
    }
    set options(options) {
        this.config.options = options;
    }
    get registry() {
        return registry;
    }
    _initialize() {
        this.notifyPlugins('beforeInit');
        if (this.options.responsive) {
            this.resize();
        } else {
            retinaScale(this, this.options.devicePixelRatio);
        }
        this.bindEvents();
        this.notifyPlugins('afterInit');
        return this;
    }
    clear() {
        clearCanvas(this.canvas, this.ctx);
        return this;
    }
    stop() {
        animator.stop(this);
        return this;
    }
    resize(width, height) {
        if (!animator.running(this)) {
            this._resize(width, height);
        } else {
            this._resizeBeforeDraw = {
                width,
                height
            };
        }
    }
    _resize(width, height) {
        const options = this.options;
        const canvas = this.canvas;
        const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
        const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
        const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
        const mode = this.width ? 'resize' : 'attach';
        this.width = newSize.width;
        this.height = newSize.height;
        this._aspectRatio = this.aspectRatio;
        if (!retinaScale(this, newRatio, true)) {
            return;
        }
        this.notifyPlugins('resize', {
            size: newSize
        });
        callback(options.onResize, [
            this,
            newSize
        ], this);
        if (this.attached) {
            if (this._doResize(mode)) {
                this.render();
            }
        }
    }
    ensureScalesHaveIDs() {
        const options = this.options;
        const scalesOptions = options.scales || {};
        each(scalesOptions, (axisOptions, axisID) => {
            axisOptions.id = axisID;
        });
    }
    buildOrUpdateScales() {
        const options = this.options;
        const scaleOpts = options.scales;
        const scales = this.scales;
        const updated = Object.keys(scales).reduce((obj, id) => {
            obj[id] = false;
            return obj;
        }, {});
        let items = [];
        if (scaleOpts) {
            items = items.concat(Object.keys(scaleOpts).map((id) => {
                const scaleOptions = scaleOpts[id];
                const axis = determineAxis(id, scaleOptions);
                const isRadial = axis === 'r';
                const isHorizontal = axis === 'x';
                return {
                    options: scaleOptions,
                    dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
                    dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
                };
            }));
        }
        each(items, (item) => {
            const scaleOptions = item.options;
            const id = scaleOptions.id;
            const axis = determineAxis(id, scaleOptions);
            const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
            if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
                scaleOptions.position = item.dposition;
            }
            updated[id] = true;
            let scale = null;
            if (id in scales && scales[id].type === scaleType) {
                scale = scales[id];
            } else {
                const scaleClass = registry.getScale(scaleType);
                scale = new scaleClass({
                    id,
                    type: scaleType,
                    ctx: this.ctx,
                    chart: this
                });
                scales[scale.id] = scale;
            }
            scale.init(scaleOptions, options);
        });
        each(updated, (hasUpdated, id) => {
            if (!hasUpdated) {
                delete scales[id];
            }
        });
        each(scales, (scale) => {
            layouts.configure(this, scale, scale.options);
            layouts.addBox(this, scale);
        });
    }
    _updateMetasets() {
        const metasets = this._metasets;
        const numData = this.data.datasets.length;
        const numMeta = metasets.length;
        metasets.sort((a, b) => a.index - b.index);
        if (numMeta > numData) {
            for (let i = numData; i < numMeta; ++i) {
                this._destroyDatasetMeta(i);
            }
            metasets.splice(numData, numMeta - numData);
        }
        this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
    }
    _removeUnreferencedMetasets() {
        const { _metasets: metasets, data: { datasets } } = this;
        if (metasets.length > datasets.length) {
            delete this._stacks;
        }
        metasets.forEach((meta, index) => {
            if (datasets.filter((x) => x === meta._dataset).length === 0) {
                this._destroyDatasetMeta(index);
            }
        });
    }
    buildOrUpdateControllers() {
        const newControllers = [];
        const datasets = this.data.datasets;
        let i, ilen;
        this._removeUnreferencedMetasets();
        for (i = 0, ilen = datasets.length; i < ilen; i++) {
            const dataset = datasets[i];
            let meta = this.getDatasetMeta(i);
            const type = dataset.type || this.config.type;
            if (meta.type && meta.type !== type) {
                this._destroyDatasetMeta(i);
                meta = this.getDatasetMeta(i);
            }
            meta.type = type;
            meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
            meta.order = dataset.order || 0;
            meta.index = i;
            meta.label = '' + dataset.label;
            meta.visible = this.isDatasetVisible(i);
            if (meta.controller) {
                meta.controller.updateIndex(i);
                meta.controller.linkScales();
            } else {
                const ControllerClass = registry.getController(type);
                const { datasetElementType, dataElementType } = defaults.datasets[type];
                Object.assign(ControllerClass, {
                    dataElementType: registry.getElement(dataElementType),
                    datasetElementType: datasetElementType && registry.getElement(datasetElementType)
                });
                meta.controller = new ControllerClass(this, i);
                newControllers.push(meta.controller);
            }
        }
        this._updateMetasets();
        return newControllers;
    }
    _resetElements() {
        each(this.data.datasets, (dataset, datasetIndex) => {
            this.getDatasetMeta(datasetIndex).controller.reset();
        }, this);
    }
    reset() {
        this._resetElements();
        this.notifyPlugins('reset');
    }
    update(mode) {
        const config = this.config;
        config.update();
        const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
        const animsDisabled = this._animationsDisabled = !options.animation;
        this._updateScales();
        this._checkEventBindings();
        this._updateHiddenIndices();
        this._plugins.invalidate();
        if (this.notifyPlugins('beforeUpdate', {
            mode,
            cancelable: true
        }) === false) {
            return;
        }
        const newControllers = this.buildOrUpdateControllers();
        this.notifyPlugins('beforeElementsUpdate');
        let minPadding = 0;
        for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
            const { controller } = this.getDatasetMeta(i);
            const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
            controller.buildOrUpdateElements(reset);
            minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
        }
        minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
        this._updateLayout(minPadding);
        if (!animsDisabled) {
            each(newControllers, (controller) => {
                controller.reset();
            });
        }
        this._updateDatasets(mode);
        this.notifyPlugins('afterUpdate', {
            mode
        });
        this._layers.sort(compare2Level('z', '_idx'));
        const { _active, _lastEvent } = this;
        if (_lastEvent) {
            this._eventHandler(_lastEvent, true);
        } else if (_active.length) {
            this._updateHoverStyles(_active, _active, true);
        }
        this.render();
    }
    _updateScales() {
        each(this.scales, (scale) => {
            layouts.removeBox(this, scale);
        });
        this.ensureScalesHaveIDs();
        this.buildOrUpdateScales();
    }
    _checkEventBindings() {
        const options = this.options;
        const existingEvents = new Set(Object.keys(this._listeners));
        const newEvents = new Set(options.events);
        if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
            this.unbindEvents();
            this.bindEvents();
        }
    }
    _updateHiddenIndices() {
        const { _hiddenIndices } = this;
        const changes = this._getUniformDataChanges() || [];
        for (const { method, start, count } of changes) {
            const move = method === '_removeElements' ? -count : count;
            moveNumericKeys(_hiddenIndices, start, move);
        }
    }
    _getUniformDataChanges() {
        const _dataChanges = this._dataChanges;
        if (!_dataChanges || !_dataChanges.length) {
            return;
        }
        this._dataChanges = [];
        const datasetCount = this.data.datasets.length;
        const makeSet = (idx) => new Set(_dataChanges.filter((c) => c[0] === idx).map((c, i) => i + ',' + c.splice(1).join(',')));
        const changeSet = makeSet(0);
        for (let i = 1; i < datasetCount; i++) {
            if (!setsEqual(changeSet, makeSet(i))) {
                return;
            }
        }
        return Array.from(changeSet).map((c) => c.split(',')).map((a) => ({
            method: a[1],
            start: +a[2],
            count: +a[3]
        }));
    }
    _updateLayout(minPadding) {
        if (this.notifyPlugins('beforeLayout', {
            cancelable: true
        }) === false) {
            return;
        }
        layouts.update(this, this.width, this.height, minPadding);
        const area = this.chartArea;
        const noArea = area.width <= 0 || area.height <= 0;
        this._layers = [];
        each(this.boxes, (box) => {
            if (noArea && box.position === 'chartArea') {
                return;
            }
            if (box.configure) {
                box.configure();
            }
            this._layers.push(...box._layers());
        }, this);
        this._layers.forEach((item, index) => {
            item._idx = index;
        });
        this.notifyPlugins('afterLayout');
    }
    _updateDatasets(mode) {
        if (this.notifyPlugins('beforeDatasetsUpdate', {
            mode,
            cancelable: true
        }) === false) {
            return;
        }
        for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
            this.getDatasetMeta(i).controller.configure();
        }
        for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
            this._updateDataset(i, isFunction(mode) ? mode({
                datasetIndex: i
            }) : mode);
        }
        this.notifyPlugins('afterDatasetsUpdate', {
            mode
        });
    }
    _updateDataset(index, mode) {
        const meta = this.getDatasetMeta(index);
        const args = {
            meta,
            index,
            mode,
            cancelable: true
        };
        if (this.notifyPlugins('beforeDatasetUpdate', args) === false) {
            return;
        }
        meta.controller._update(mode);
        args.cancelable = false;
        this.notifyPlugins('afterDatasetUpdate', args);
    }
    render() {
        if (this.notifyPlugins('beforeRender', {
            cancelable: true
        }) === false) {
            return;
        }
        if (animator.has(this)) {
            if (this.attached && !animator.running(this)) {
                animator.start(this);
            }
        } else {
            this.draw();
            onAnimationsComplete({
                chart: this
            });
        }
    }
    draw() {
        let i;
        if (this._resizeBeforeDraw) {
            const { width, height } = this._resizeBeforeDraw;
            this._resizeBeforeDraw = null;
            this._resize(width, height);
        }
        this.clear();
        if (this.width <= 0 || this.height <= 0) {
            return;
        }
        if (this.notifyPlugins('beforeDraw', {
            cancelable: true
        }) === false) {
            return;
        }
        const layers = this._layers;
        for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
            layers[i].draw(this.chartArea);
        }
        this._drawDatasets();
        for (; i < layers.length; ++i) {
            layers[i].draw(this.chartArea);
        }
        this.notifyPlugins('afterDraw');
    }
    _getSortedDatasetMetas(filterVisible) {
        const metasets = this._sortedMetasets;
        const result = [];
        let i, ilen;
        for (i = 0, ilen = metasets.length; i < ilen; ++i) {
            const meta = metasets[i];
            if (!filterVisible || meta.visible) {
                result.push(meta);
            }
        }
        return result;
    }
    getSortedVisibleDatasetMetas() {
        return this._getSortedDatasetMetas(true);
    }
    _drawDatasets() {
        if (this.notifyPlugins('beforeDatasetsDraw', {
            cancelable: true
        }) === false) {
            return;
        }
        const metasets = this.getSortedVisibleDatasetMetas();
        for (let i = metasets.length - 1; i >= 0; --i) {
            this._drawDataset(metasets[i]);
        }
        this.notifyPlugins('afterDatasetsDraw');
    }
    _drawDataset(meta) {
        const ctx = this.ctx;
        const args = {
            meta,
            index: meta.index,
            cancelable: true
        };
        const clip = getDatasetClipArea(this, meta);
        if (this.notifyPlugins('beforeDatasetDraw', args) === false) {
            return;
        }
        if (clip) {
            clipArea(ctx, clip);
        }
        meta.controller.draw();
        if (clip) {
            unclipArea(ctx);
        }
        args.cancelable = false;
        this.notifyPlugins('afterDatasetDraw', args);
    }
    isPointInArea(point) {
        return _isPointInArea(point, this.chartArea, this._minPadding);
    }
    getElementsAtEventForMode(e, mode, options, useFinalPosition) {
        const method = Interaction.modes[mode];
        if (typeof method === 'function') {
            return method(this, e, options, useFinalPosition);
        }
        return [];
    }
    getDatasetMeta(datasetIndex) {
        const dataset = this.data.datasets[datasetIndex];
        const metasets = this._metasets;
        let meta = metasets.filter((x) => x && x._dataset === dataset).pop();
        if (!meta) {
            meta = {
                type: null,
                data: [],
                dataset: null,
                controller: null,
                hidden: null,
                xAxisID: null,
                yAxisID: null,
                order: dataset && dataset.order || 0,
                index: datasetIndex,
                _dataset: dataset,
                _parsed: [],
                _sorted: false
            };
            metasets.push(meta);
        }
        return meta;
    }
    getContext() {
        return this.$context || (this.$context = createContext(null, {
            chart: this,
            type: 'chart'
        }));
    }
    getVisibleDatasetCount() {
        return this.getSortedVisibleDatasetMetas().length;
    }
    isDatasetVisible(datasetIndex) {
        const dataset = this.data.datasets[datasetIndex];
        if (!dataset) {
            return false;
        }
        const meta = this.getDatasetMeta(datasetIndex);
        return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
    }
    setDatasetVisibility(datasetIndex, visible) {
        const meta = this.getDatasetMeta(datasetIndex);
        meta.hidden = !visible;
    }
    toggleDataVisibility(index) {
        this._hiddenIndices[index] = !this._hiddenIndices[index];
    }
    getDataVisibility(index) {
        return !this._hiddenIndices[index];
    }
    _updateVisibility(datasetIndex, dataIndex, visible) {
        const mode = visible ? 'show' : 'hide';
        const meta = this.getDatasetMeta(datasetIndex);
        const anims = meta.controller._resolveAnimations(undefined, mode);
        if (defined(dataIndex)) {
            meta.data[dataIndex].hidden = !visible;
            this.update();
        } else {
            this.setDatasetVisibility(datasetIndex, visible);
            anims.update(meta, {
                visible
            });
            this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : undefined);
        }
    }
    hide(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, false);
    }
    show(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, true);
    }
    _destroyDatasetMeta(datasetIndex) {
        const meta = this._metasets[datasetIndex];
        if (meta && meta.controller) {
            meta.controller._destroy();
        }
        delete this._metasets[datasetIndex];
    }
    _stop() {
        let i, ilen;
        this.stop();
        animator.remove(this);
        for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
            this._destroyDatasetMeta(i);
        }
    }
    destroy() {
        this.notifyPlugins('beforeDestroy');
        const { canvas, ctx } = this;
        this._stop();
        this.config.clearCache();
        if (canvas) {
            this.unbindEvents();
            clearCanvas(canvas, ctx);
            this.platform.releaseContext(ctx);
            this.canvas = null;
            this.ctx = null;
        }
        delete instances[this.id];
        this.notifyPlugins('afterDestroy');
    }
    toBase64Image(...args) {
        return this.canvas.toDataURL(...args);
    }
    bindEvents() {
        this.bindUserEvents();
        if (this.options.responsive) {
            this.bindResponsiveEvents();
        } else {
            this.attached = true;
        }
    }
    bindUserEvents() {
        const listeners = this._listeners;
        const platform = this.platform;
        const _add = (type, listener) => {
            platform.addEventListener(this, type, listener);
            listeners[type] = listener;
        };
        const listener = (e, x, y) => {
            e.offsetX = x;
            e.offsetY = y;
            this._eventHandler(e);
        };
        each(this.options.events, (type) => _add(type, listener));
    }
    bindResponsiveEvents() {
        if (!this._responsiveListeners) {
            this._responsiveListeners = {};
        }
        const listeners = this._responsiveListeners;
        const platform = this.platform;
        const _add = (type, listener) => {
            platform.addEventListener(this, type, listener);
            listeners[type] = listener;
        };
        const _remove = (type, listener) => {
            if (listeners[type]) {
                platform.removeEventListener(this, type, listener);
                delete listeners[type];
            }
        };
        const listener = (width, height) => {
            if (this.canvas) {
                this.resize(width, height);
            }
        };
        let detached;
        const attached = () => {
            _remove('attach', attached);
            this.attached = true;
            this.resize();
            _add('resize', listener);
            _add('detach', detached);
        };
        detached = () => {
            this.attached = false;
            _remove('resize', listener);
            this._stop();
            this._resize(0, 0);
            _add('attach', attached);
        };
        if (platform.isAttached(this.canvas)) {
            attached();
        } else {
            detached();
        }
    }
    unbindEvents() {
        each(this._listeners, (listener, type) => {
            this.platform.removeEventListener(this, type, listener);
        });
        this._listeners = {};
        each(this._responsiveListeners, (listener, type) => {
            this.platform.removeEventListener(this, type, listener);
        });
        this._responsiveListeners = undefined;
    }
    updateHoverStyle(items, mode, enabled) {
        const prefix = enabled ? 'set' : 'remove';
        let meta, item, i, ilen;
        if (mode === 'dataset') {
            meta = this.getDatasetMeta(items[0].datasetIndex);
            meta.controller['_' + prefix + 'DatasetHoverStyle']();
        }
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            item = items[i];
            const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
            if (controller) {
                controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
            }
        }
    }
    getActiveElements() {
        return this._active || [];
    }
    setActiveElements(activeElements) {
        const lastActive = this._active || [];
        const active = activeElements.map(({ datasetIndex, index }) => {
            const meta = this.getDatasetMeta(datasetIndex);
            if (!meta) {
                throw new Error('No dataset found at index ' + datasetIndex);
            }
            return {
                datasetIndex,
                element: meta.data[index],
                index
            };
        });
        const changed = !_elementsEqual(active, lastActive);
        if (changed) {
            this._active = active;
            this._lastEvent = null;
            this._updateHoverStyles(active, lastActive);
        }
    }
    notifyPlugins(hook, args, filter) {
        return this._plugins.notify(this, hook, args, filter);
    }
    isPluginEnabled(pluginId) {
        return this._plugins._cache.filter((p) => p.plugin.id === pluginId).length === 1;
    }
    _updateHoverStyles(active, lastActive, replay) {
        const hoverOptions = this.options.hover;
        const diff = (a, b) => a.filter((x) => !b.some((y) => x.datasetIndex === y.datasetIndex && x.index === y.index));
        const deactivated = diff(lastActive, active);
        const activated = replay ? active : diff(active, lastActive);
        if (deactivated.length) {
            this.updateHoverStyle(deactivated, hoverOptions.mode, false);
        }
        if (activated.length && hoverOptions.mode) {
            this.updateHoverStyle(activated, hoverOptions.mode, true);
        }
    }
    _eventHandler(e, replay) {
        const args = {
            event: e,
            replay,
            cancelable: true,
            inChartArea: this.isPointInArea(e)
        };
        const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
        if (this.notifyPlugins('beforeEvent', args, eventFilter) === false) {
            return;
        }
        const changed = this._handleEvent(e, replay, args.inChartArea);
        args.cancelable = false;
        this.notifyPlugins('afterEvent', args, eventFilter);
        if (changed || args.changed) {
            this.render();
        }
        return this;
    }
    _handleEvent(e, replay, inChartArea) {
        const { _active: lastActive = [], options } = this;
        const useFinalPosition = replay;
        const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
        const isClick = _isClickEvent(e);
        const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
        if (inChartArea) {
            this._lastEvent = null;
            callback(options.onHover, [
                e,
                active,
                this
            ], this);
            if (isClick) {
                callback(options.onClick, [
                    e,
                    active,
                    this
                ], this);
            }
        }
        const changed = !_elementsEqual(active, lastActive);
        if (changed || replay) {
            this._active = active;
            this._updateHoverStyles(active, lastActive, replay);
        }
        this._lastEvent = lastEvent;
        return changed;
    }
    _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
        if (e.type === 'mouseout') {
            return [];
        }
        if (!inChartArea) {
            return lastActive;
        }
        const hoverOptions = this.options.hover;
        return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
    }
}
function invalidatePlugins() {
    return each(Chart.instances, (chart) => chart._plugins.invalidate());
}

function clipSelf(ctx, element, endAngle) {
    const { startAngle, x, y, outerRadius, innerRadius, options } = element;
    const { borderWidth, borderJoinStyle } = options;
    const outerAngleClip = Math.min(borderWidth / outerRadius, _normalizeAngle(startAngle - endAngle));
    ctx.beginPath();
    ctx.arc(x, y, outerRadius - borderWidth / 2, startAngle + outerAngleClip / 2, endAngle - outerAngleClip / 2);
    if (innerRadius > 0) {
        const innerAngleClip = Math.min(borderWidth / innerRadius, _normalizeAngle(startAngle - endAngle));
        ctx.arc(x, y, innerRadius + borderWidth / 2, endAngle - innerAngleClip / 2, startAngle + innerAngleClip / 2, true);
    } else {
        const clipWidth = Math.min(borderWidth / 2, outerRadius * _normalizeAngle(startAngle - endAngle));
        if (borderJoinStyle === 'round') {
            ctx.arc(x, y, clipWidth, endAngle - PI / 2, startAngle + PI / 2, true);
        } else if (borderJoinStyle === 'bevel') {
            const r = 2 * clipWidth * clipWidth;
            const endX = -r * Math.cos(endAngle + PI / 2) + x;
            const endY = -r * Math.sin(endAngle + PI / 2) + y;
            const startX = r * Math.cos(startAngle + PI / 2) + x;
            const startY = r * Math.sin(startAngle + PI / 2) + y;
            ctx.lineTo(endX, endY);
            ctx.lineTo(startX, startY);
        }
    }
    ctx.closePath();
    ctx.moveTo(0, 0);
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.clip('evenodd');
}
function clipArc(ctx, element, endAngle) {
    const { startAngle, pixelMargin, x, y, outerRadius, innerRadius } = element;
    let angleMargin = pixelMargin / outerRadius;
    // Draw an inner border by clipping the arc and drawing a double-width border
    // Enlarge the clipping arc by 0.33 pixels to eliminate glitches between borders
    ctx.beginPath();
    ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
    if (innerRadius > pixelMargin) {
        angleMargin = pixelMargin / innerRadius;
        ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
    } else {
        ctx.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
    }
    ctx.closePath();
    ctx.clip();
}
function toRadiusCorners(value) {
    return _readValueToProps(value, [
        'outerStart',
        'outerEnd',
        'innerStart',
        'innerEnd'
    ]);
}
/**
 * Parse border radius from the provided options
 */ function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
    const o = toRadiusCorners(arc.options.borderRadius);
    const halfThickness = (outerRadius - innerRadius) / 2;
    const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
    // Outer limits are complicated. We want to compute the available angular distance at
    // a radius of outerRadius - borderRadius because for small angular distances, this term limits.
    // We compute at r = outerRadius - borderRadius because this circle defines the center of the border corners.
    //
    // If the borderRadius is large, that value can become negative.
    // This causes the outer borders to lose their radius entirely, which is rather unexpected. To solve that, if borderRadius > outerRadius
    // we know that the thickness term will dominate and compute the limits at that point
    const computeOuterLimit = (val) => {
        const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
        return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
    };
    return {
        outerStart: computeOuterLimit(o.outerStart),
        outerEnd: computeOuterLimit(o.outerEnd),
        innerStart: _limitValue(o.innerStart, 0, innerLimit),
        innerEnd: _limitValue(o.innerEnd, 0, innerLimit)
    };
}
/**
 * Convert (r, 𝜃) to (x, y)
 */ function rThetaToXY(r, theta, x, y) {
    return {
        x: x + r * Math.cos(theta),
        y: y + r * Math.sin(theta)
    };
}
/**
 * Path the arc, respecting border radius by separating into left and right halves.
 *
 *   Start      End
 *
 *    1--->a--->2    Outer
 *   /           \
 *   8           3
 *   |           |
 *   |           |
 *   7           4
 *   \           /
 *    6<---b<---5    Inner
 */ function pathArc(ctx, element, offset, spacing, end, circular) {
    const { x, y, startAngle: start, pixelMargin, innerRadius: innerR } = element;
    const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
    const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
    let spacingOffset = 0;
    const alpha = end - start;
    if (spacing) {
        // When spacing is present, it is the same for all items
        // So we adjust the start and end angle of the arc such that
        // the distance is the same as it would be without the spacing
        const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
        const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
        const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
        const adjustedAngle = avNogSpacingRadius !== 0 ? alpha * avNogSpacingRadius / (avNogSpacingRadius + spacing) : alpha;
        spacingOffset = (alpha - adjustedAngle) / 2;
    }
    const beta = Math.max(0.001, alpha * outerRadius - offset / PI) / outerRadius;
    const angleOffset = (alpha - beta) / 2;
    const startAngle = start + angleOffset + spacingOffset;
    const endAngle = end - angleOffset - spacingOffset;
    const { outerStart, outerEnd, innerStart, innerEnd } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
    const outerStartAdjustedRadius = outerRadius - outerStart;
    const outerEndAdjustedRadius = outerRadius - outerEnd;
    const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
    const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
    const innerStartAdjustedRadius = innerRadius + innerStart;
    const innerEndAdjustedRadius = innerRadius + innerEnd;
    const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
    const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
    ctx.beginPath();
    if (circular) {
        // The first arc segments from point 1 to point a to point 2
        const outerMidAdjustedAngle = (outerStartAdjustedAngle + outerEndAdjustedAngle) / 2;
        ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerMidAdjustedAngle);
        ctx.arc(x, y, outerRadius, outerMidAdjustedAngle, outerEndAdjustedAngle);
        // The corner segment from point 2 to point 3
        if (outerEnd > 0) {
            const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
        }
        // The line from point 3 to point 4
        const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
        ctx.lineTo(p4.x, p4.y);
        // The corner segment from point 4 to point 5
        if (innerEnd > 0) {
            const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
        }
        // The inner arc from point 5 to point b to point 6
        const innerMidAdjustedAngle = (endAngle - innerEnd / innerRadius + (startAngle + innerStart / innerRadius)) / 2;
        ctx.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, innerMidAdjustedAngle, true);
        ctx.arc(x, y, innerRadius, innerMidAdjustedAngle, startAngle + innerStart / innerRadius, true);
        // The corner segment from point 6 to point 7
        if (innerStart > 0) {
            const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
        }
        // The line from point 7 to point 8
        const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
        ctx.lineTo(p8.x, p8.y);
        // The corner segment from point 8 to point 1
        if (outerStart > 0) {
            const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
            ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
        }
    } else {
        ctx.moveTo(x, y);
        const outerStartX = Math.cos(outerStartAdjustedAngle) * outerRadius + x;
        const outerStartY = Math.sin(outerStartAdjustedAngle) * outerRadius + y;
        ctx.lineTo(outerStartX, outerStartY);
        const outerEndX = Math.cos(outerEndAdjustedAngle) * outerRadius + x;
        const outerEndY = Math.sin(outerEndAdjustedAngle) * outerRadius + y;
        ctx.lineTo(outerEndX, outerEndY);
    }
    ctx.closePath();
}
function drawArc(ctx, element, offset, spacing, circular) {
    const { fullCircles, startAngle, circumference } = element;
    let endAngle = element.endAngle;
    if (fullCircles) {
        pathArc(ctx, element, offset, spacing, endAngle, circular);
        for (let i = 0; i < fullCircles; ++i) {
            ctx.fill();
        }
        if (!isNaN(circumference)) {
            endAngle = startAngle + (circumference % TAU || TAU);
        }
    }
    pathArc(ctx, element, offset, spacing, endAngle, circular);
    ctx.fill();
    return endAngle;
}
function drawBorder(ctx, element, offset, spacing, circular) {
    const { fullCircles, startAngle, circumference, options } = element;
    const { borderWidth, borderJoinStyle, borderDash, borderDashOffset, borderRadius } = options;
    const inner = options.borderAlign === 'inner';
    if (!borderWidth) {
        return;
    }
    ctx.setLineDash(borderDash || []);
    ctx.lineDashOffset = borderDashOffset;
    if (inner) {
        ctx.lineWidth = borderWidth * 2;
        ctx.lineJoin = borderJoinStyle || 'round';
    } else {
        ctx.lineWidth = borderWidth;
        ctx.lineJoin = borderJoinStyle || 'bevel';
    }
    let endAngle = element.endAngle;
    if (fullCircles) {
        pathArc(ctx, element, offset, spacing, endAngle, circular);
        for (let i = 0; i < fullCircles; ++i) {
            ctx.stroke();
        }
        if (!isNaN(circumference)) {
            endAngle = startAngle + (circumference % TAU || TAU);
        }
    }
    if (inner) {
        clipArc(ctx, element, endAngle);
    }
    if (options.selfJoin && endAngle - startAngle >= PI && borderRadius === 0 && borderJoinStyle !== 'miter') {
        clipSelf(ctx, element, endAngle);
    }
    if (!fullCircles) {
        pathArc(ctx, element, offset, spacing, endAngle, circular);
        ctx.stroke();
    }
}
class ArcElement extends Element {
    static id = 'arc';
    static defaults = {
        borderAlign: 'center',
        borderColor: '#fff',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: undefined,
        borderRadius: 0,
        borderWidth: 2,
        offset: 0,
        spacing: 0,
        angle: undefined,
        circular: true,
        selfJoin: false
    };
    static defaultRoutes = {
        backgroundColor: 'backgroundColor'
    };
    static descriptors = {
        _scriptable: true,
        _indexable: (name) => name !== 'borderDash'
    };
    circumference;
    endAngle;
    fullCircles;
    innerRadius;
    outerRadius;
    pixelMargin;
    startAngle;
    constructor(cfg) {
        super();
        this.options = undefined;
        this.circumference = undefined;
        this.startAngle = undefined;
        this.endAngle = undefined;
        this.innerRadius = undefined;
        this.outerRadius = undefined;
        this.pixelMargin = 0;
        this.fullCircles = 0;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    inRange(chartX, chartY, useFinalPosition) {
        const point = this.getProps([
            'x',
            'y'
        ], useFinalPosition);
        const { angle, distance } = getAngleFromPoint(point, {
            x: chartX,
            y: chartY
        });
        const { startAngle, endAngle, innerRadius, outerRadius, circumference } = this.getProps([
            'startAngle',
            'endAngle',
            'innerRadius',
            'outerRadius',
            'circumference'
        ], useFinalPosition);
        const rAdjust = (this.options.spacing + this.options.borderWidth) / 2;
        const _circumference = valueOrDefault(circumference, endAngle - startAngle);
        const nonZeroBetween = _angleBetween(angle, startAngle, endAngle) && startAngle !== endAngle;
        const betweenAngles = _circumference >= TAU || nonZeroBetween;
        const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
        return betweenAngles && withinRadius;
    }
    getCenterPoint(useFinalPosition) {
        const { x, y, startAngle, endAngle, innerRadius, outerRadius } = this.getProps([
            'x',
            'y',
            'startAngle',
            'endAngle',
            'innerRadius',
            'outerRadius'
        ], useFinalPosition);
        const { offset, spacing } = this.options;
        const halfAngle = (startAngle + endAngle) / 2;
        const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
        return {
            x: x + Math.cos(halfAngle) * halfRadius,
            y: y + Math.sin(halfAngle) * halfRadius
        };
    }
    tooltipPosition(useFinalPosition) {
        return this.getCenterPoint(useFinalPosition);
    }
    draw(ctx) {
        const { options, circumference } = this;
        const offset = (options.offset || 0) / 4;
        const spacing = (options.spacing || 0) / 2;
        const circular = options.circular;
        this.pixelMargin = options.borderAlign === 'inner' ? 0.33 : 0;
        this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
        if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
            return;
        }
        ctx.save();
        const halfAngle = (this.startAngle + this.endAngle) / 2;
        ctx.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
        const fix = 1 - Math.sin(Math.min(PI, circumference || 0));
        const radiusOffset = offset * fix;
        ctx.fillStyle = options.backgroundColor;
        ctx.strokeStyle = options.borderColor;
        drawArc(ctx, this, radiusOffset, spacing, circular);
        drawBorder(ctx, this, radiusOffset, spacing, circular);
        ctx.restore();
    }
}

function setStyle(ctx, options, style = options) {
    ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
    ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
    ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
    ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
    ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
    ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
}
function lineTo(ctx, previous, target) {
    ctx.lineTo(target.x, target.y);
}
function getLineMethod(options) {
    if (options.stepped) {
        return _steppedLineTo;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return _bezierCurveTo;
    }
    return lineTo;
}
function pathVars(points, segment, params = {}) {
    const count = points.length;
    const { start: paramsStart = 0, end: paramsEnd = count - 1 } = params;
    const { start: segmentStart, end: segmentEnd } = segment;
    const start = Math.max(paramsStart, segmentStart);
    const end = Math.min(paramsEnd, segmentEnd);
    const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
    return {
        count,
        start,
        loop: segment.loop,
        ilen: end < start && !outside ? count + end - start : end - start
    };
}
function pathSegment(ctx, line, segment, params) {
    const { points, options } = line;
    const { count, start, loop, ilen } = pathVars(points, segment, params);
    const lineMethod = getLineMethod(options);
    let { move = true, reverse } = params || {};
    let i, point, prev;
    for (i = 0; i <= ilen; ++i) {
        point = points[(start + (reverse ? ilen - i : i)) % count];
        if (point.skip) {
            continue;
        } else if (move) {
            ctx.moveTo(point.x, point.y);
            move = false;
        } else {
            lineMethod(ctx, prev, point, reverse, options.stepped);
        }
        prev = point;
    }
    if (loop) {
        point = points[(start + (reverse ? ilen : 0)) % count];
        lineMethod(ctx, prev, point, reverse, options.stepped);
    }
    return !!loop;
}
function fastPathSegment(ctx, line, segment, params) {
    const points = line.points;
    const { count, start, ilen } = pathVars(points, segment, params);
    const { move = true, reverse } = params || {};
    let avgX = 0;
    let countX = 0;
    let i, point, prevX, minY, maxY, lastY;
    const pointIndex = (index) => (start + (reverse ? ilen - index : index)) % count;
    const drawX = () => {
        if (minY !== maxY) {
            ctx.lineTo(avgX, maxY);
            ctx.lineTo(avgX, minY);
            ctx.lineTo(avgX, lastY);
        }
    };
    if (move) {
        point = points[pointIndex(0)];
        ctx.moveTo(point.x, point.y);
    }
    for (i = 0; i <= ilen; ++i) {
        point = points[pointIndex(i)];
        if (point.skip) {
            continue;
        }
        const x = point.x;
        const y = point.y;
        const truncX = x | 0;
        if (truncX === prevX) {
            if (y < minY) {
                minY = y;
            } else if (y > maxY) {
                maxY = y;
            }
            avgX = (countX * avgX + x) / ++countX;
        } else {
            drawX();
            ctx.lineTo(x, y);
            prevX = truncX;
            countX = 0;
            minY = maxY = y;
        }
        lastY = y;
    }
    drawX();
}
function _getSegmentMethod(line) {
    const opts = line.options;
    const borderDash = opts.borderDash && opts.borderDash.length;
    const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
    return useFastPath ? fastPathSegment : pathSegment;
}
function _getInterpolationMethod(options) {
    if (options.stepped) {
        return _steppedInterpolation;
    }
    if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return _bezierInterpolation;
    }
    return _pointInLine;
}
function strokePathWithCache(ctx, line, start, count) {
    let path = line._path;
    if (!path) {
        path = line._path = new Path2D();
        if (line.path(path, start, count)) {
            path.closePath();
        }
    }
    setStyle(ctx, line.options);
    ctx.stroke(path);
}
function strokePathDirect(ctx, line, start, count) {
    const { segments, options } = line;
    const segmentMethod = _getSegmentMethod(line);
    for (const segment of segments) {
        setStyle(ctx, options, segment.style);
        ctx.beginPath();
        if (segmentMethod(ctx, line, segment, {
            start,
            end: start + count - 1
        })) {
            ctx.closePath();
        }
        ctx.stroke();
    }
}
const usePath2D = typeof Path2D === 'function';
function draw(ctx, line, start, count) {
    if (usePath2D && !line.options.segment) {
        strokePathWithCache(ctx, line, start, count);
    } else {
        strokePathDirect(ctx, line, start, count);
    }
}
class LineElement extends Element {
    static id = 'line';
    static defaults = {
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        borderWidth: 3,
        capBezierPoints: true,
        cubicInterpolationMode: 'default',
        fill: false,
        spanGaps: false,
        stepped: false,
        tension: 0
    };
    static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    static descriptors = {
        _scriptable: true,
        _indexable: (name) => name !== 'borderDash' && name !== 'fill'
    };
    constructor(cfg) {
        super();
        this.animated = true;
        this.options = undefined;
        this._chart = undefined;
        this._loop = undefined;
        this._fullLoop = undefined;
        this._path = undefined;
        this._points = undefined;
        this._segments = undefined;
        this._decimated = false;
        this._pointsUpdated = false;
        this._datasetIndex = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    updateControlPoints(chartArea, indexAxis) {
        const options = this.options;
        if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !this._pointsUpdated) {
            const loop = options.spanGaps ? this._loop : this._fullLoop;
            _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
            this._pointsUpdated = true;
        }
    }
    set points(points) {
        this._points = points;
        delete this._segments;
        delete this._path;
        this._pointsUpdated = false;
    }
    get points() {
        return this._points;
    }
    get segments() {
        return this._segments || (this._segments = _computeSegments(this, this.options.segment));
    }
    first() {
        const segments = this.segments;
        const points = this.points;
        return segments.length && points[segments[0].start];
    }
    last() {
        const segments = this.segments;
        const points = this.points;
        const count = segments.length;
        return count && points[segments[count - 1].end];
    }
    interpolate(point, property) {
        const options = this.options;
        const value = point[property];
        const points = this.points;
        const segments = _boundSegments(this, {
            property,
            start: value,
            end: value
        });
        if (!segments.length) {
            return;
        }
        const result = [];
        const _interpolate = _getInterpolationMethod(options);
        let i, ilen;
        for (i = 0, ilen = segments.length; i < ilen; ++i) {
            const { start, end } = segments[i];
            const p1 = points[start];
            const p2 = points[end];
            if (p1 === p2) {
                result.push(p1);
                continue;
            }
            const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
            const interpolated = _interpolate(p1, p2, t, options.stepped);
            interpolated[property] = point[property];
            result.push(interpolated);
        }
        return result.length === 1 ? result[0] : result;
    }
    pathSegment(ctx, segment, params) {
        const segmentMethod = _getSegmentMethod(this);
        return segmentMethod(ctx, this, segment, params);
    }
    path(ctx, start, count) {
        const segments = this.segments;
        const segmentMethod = _getSegmentMethod(this);
        let loop = this._loop;
        start = start || 0;
        count = count || this.points.length - start;
        for (const segment of segments) {
            loop &= segmentMethod(ctx, this, segment, {
                start,
                end: start + count - 1
            });
        }
        return !!loop;
    }
    draw(ctx, chartArea, start, count) {
        const options = this.options || {};
        const points = this.points || [];
        if (points.length && options.borderWidth) {
            ctx.save();
            draw(ctx, this, start, count);
            ctx.restore();
        }
        if (this.animated) {
            this._pointsUpdated = false;
            this._path = undefined;
        }
    }
}

function inRange$1(el, pos, axis, useFinalPosition) {
    const options = el.options;
    const { [axis]: value } = el.getProps([
        axis
    ], useFinalPosition);
    return Math.abs(pos - value) < options.radius + options.hitRadius;
}
class PointElement extends Element {
    static id = 'point';
    parsed;
    skip;
    stop;
    /**
   * @type {any}
   */ static defaults = {
        borderWidth: 1,
        hitRadius: 1,
        hoverBorderWidth: 1,
        hoverRadius: 4,
        pointStyle: 'circle',
        radius: 3,
        rotation: 0
    };
    /**
   * @type {any}
   */ static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    constructor(cfg) {
        super();
        this.options = undefined;
        this.parsed = undefined;
        this.skip = undefined;
        this.stop = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    inRange(mouseX, mouseY, useFinalPosition) {
        const options = this.options;
        const { x, y } = this.getProps([
            'x',
            'y'
        ], useFinalPosition);
        return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
    }
    inXRange(mouseX, useFinalPosition) {
        return inRange$1(this, mouseX, 'x', useFinalPosition);
    }
    inYRange(mouseY, useFinalPosition) {
        return inRange$1(this, mouseY, 'y', useFinalPosition);
    }
    getCenterPoint(useFinalPosition) {
        const { x, y } = this.getProps([
            'x',
            'y'
        ], useFinalPosition);
        return {
            x,
            y
        };
    }
    size(options) {
        options = options || this.options || {};
        let radius = options.radius || 0;
        radius = Math.max(radius, radius && options.hoverRadius || 0);
        const borderWidth = radius && options.borderWidth || 0;
        return (radius + borderWidth) * 2;
    }
    draw(ctx, area) {
        const options = this.options;
        if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
            return;
        }
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.fillStyle = options.backgroundColor;
        drawPoint(ctx, options, this.x, this.y);
    }
    getRange() {
        const options = this.options || {};
        // @ts-expect-error Fallbacks should never be hit in practice
        return options.radius + options.hitRadius;
    }
}

function getBarBounds(bar, useFinalPosition) {
    const { x, y, base, width, height } = bar.getProps([
        'x',
        'y',
        'base',
        'width',
        'height'
    ], useFinalPosition);
    let left, right, top, bottom, half;
    if (bar.horizontal) {
        half = height / 2;
        left = Math.min(x, base);
        right = Math.max(x, base);
        top = y - half;
        bottom = y + half;
    } else {
        half = width / 2;
        left = x - half;
        right = x + half;
        top = Math.min(y, base);
        bottom = Math.max(y, base);
    }
    return {
        left,
        top,
        right,
        bottom
    };
}
function skipOrLimit(skip, value, min, max) {
    return skip ? 0 : _limitValue(value, min, max);
}
function parseBorderWidth(bar, maxW, maxH) {
    const value = bar.options.borderWidth;
    const skip = bar.borderSkipped;
    const o = toTRBL(value);
    return {
        t: skipOrLimit(skip.top, o.top, 0, maxH),
        r: skipOrLimit(skip.right, o.right, 0, maxW),
        b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
        l: skipOrLimit(skip.left, o.left, 0, maxW)
    };
}
function parseBorderRadius(bar, maxW, maxH) {
    const { enableBorderRadius } = bar.getProps([
        'enableBorderRadius'
    ]);
    const value = bar.options.borderRadius;
    const o = toTRBLCorners(value);
    const maxR = Math.min(maxW, maxH);
    const skip = bar.borderSkipped;
    const enableBorder = enableBorderRadius || isObject(value);
    return {
        topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, maxR),
        topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, maxR),
        bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, maxR),
        bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, maxR)
    };
}
function boundingRects(bar) {
    const bounds = getBarBounds(bar);
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const border = parseBorderWidth(bar, width / 2, height / 2);
    const radius = parseBorderRadius(bar, width / 2, height / 2);
    return {
        outer: {
            x: bounds.left,
            y: bounds.top,
            w: width,
            h: height,
            radius
        },
        inner: {
            x: bounds.left + border.l,
            y: bounds.top + border.t,
            w: width - border.l - border.r,
            h: height - border.t - border.b,
            radius: {
                topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
                topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
                bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
                bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
            }
        }
    };
}
function inRange(bar, x, y, useFinalPosition) {
    const skipX = x === null;
    const skipY = y === null;
    const skipBoth = skipX && skipY;
    const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
    return bounds && (skipX || _isBetween(x, bounds.left, bounds.right)) && (skipY || _isBetween(y, bounds.top, bounds.bottom));
}
function hasRadius(radius) {
    return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}
function addNormalRectPath(ctx, rect) {
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
}
function inflateRect(rect, amount, refRect = {}) {
    const x = rect.x !== refRect.x ? -amount : 0;
    const y = rect.y !== refRect.y ? -amount : 0;
    const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
    const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
    return {
        x: rect.x + x,
        y: rect.y + y,
        w: rect.w + w,
        h: rect.h + h,
        radius: rect.radius
    };
}
class BarElement extends Element {
    static id = 'bar';
    static defaults = {
        borderSkipped: 'start',
        borderWidth: 0,
        borderRadius: 0,
        inflateAmount: 'auto',
        pointStyle: undefined
    };
    static defaultRoutes = {
        backgroundColor: 'backgroundColor',
        borderColor: 'borderColor'
    };
    constructor(cfg) {
        super();
        this.options = undefined;
        this.horizontal = undefined;
        this.base = undefined;
        this.width = undefined;
        this.height = undefined;
        this.inflateAmount = undefined;
        if (cfg) {
            Object.assign(this, cfg);
        }
    }
    draw(ctx) {
        const { inflateAmount, options: { borderColor, backgroundColor } } = this;
        const { inner, outer } = boundingRects(this);
        const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
        ctx.save();
        if (outer.w !== inner.w || outer.h !== inner.h) {
            ctx.beginPath();
            addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
            ctx.clip();
            addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
            ctx.fillStyle = borderColor;
            ctx.fill('evenodd');
        }
        ctx.beginPath();
        addRectPath(ctx, inflateRect(inner, inflateAmount));
        ctx.fillStyle = backgroundColor;
        ctx.fill();
        ctx.restore();
    }
    inRange(mouseX, mouseY, useFinalPosition) {
        return inRange(this, mouseX, mouseY, useFinalPosition);
    }
    inXRange(mouseX, useFinalPosition) {
        return inRange(this, mouseX, null, useFinalPosition);
    }
    inYRange(mouseY, useFinalPosition) {
        return inRange(this, null, mouseY, useFinalPosition);
    }
    getCenterPoint(useFinalPosition) {
        const { x, y, base, horizontal } = this.getProps([
            'x',
            'y',
            'base',
            'horizontal'
        ], useFinalPosition);
        return {
            x: horizontal ? (x + base) / 2 : x,
            y: horizontal ? y : (y + base) / 2
        };
    }
    getRange(axis) {
        return axis === 'x' ? this.width / 2 : this.height / 2;
    }
}

var elements = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ArcElement: ArcElement,
    BarElement: BarElement,
    LineElement: LineElement,
    PointElement: PointElement
});

const BORDER_COLORS = [
    'rgb(54, 162, 235)',
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)' // grey
];
// Border colors with 50% transparency
const BACKGROUND_COLORS = /* #__PURE__ */ BORDER_COLORS.map((color) => color.replace('rgb(', 'rgba(').replace(')', ', 0.5)'));
function getBorderColor(i) {
    return BORDER_COLORS[i % BORDER_COLORS.length];
}
function getBackgroundColor(i) {
    return BACKGROUND_COLORS[i % BACKGROUND_COLORS.length];
}
function colorizeDefaultDataset(dataset, i) {
    dataset.borderColor = getBorderColor(i);
    dataset.backgroundColor = getBackgroundColor(i);
    return ++i;
}
function colorizeDoughnutDataset(dataset, i) {
    dataset.backgroundColor = dataset.data.map(() => getBorderColor(i++));
    return i;
}
function colorizePolarAreaDataset(dataset, i) {
    dataset.backgroundColor = dataset.data.map(() => getBackgroundColor(i++));
    return i;
}
function getColorizer(chart) {
    let i = 0;
    return (dataset, datasetIndex) => {
        const controller = chart.getDatasetMeta(datasetIndex).controller;
        if (controller instanceof DoughnutController) {
            i = colorizeDoughnutDataset(dataset, i);
        } else if (controller instanceof PolarAreaController) {
            i = colorizePolarAreaDataset(dataset, i);
        } else if (controller) {
            i = colorizeDefaultDataset(dataset, i);
        }
    };
}
function containsColorsDefinitions(descriptors) {
    let k;
    for (k in descriptors) {
        if (descriptors[k].borderColor || descriptors[k].backgroundColor) {
            return true;
        }
    }
    return false;
}
function containsColorsDefinition(descriptor) {
    return descriptor && (descriptor.borderColor || descriptor.backgroundColor);
}
function containsDefaultColorsDefenitions() {
    return defaults.borderColor !== 'rgba(0,0,0,0.1)' || defaults.backgroundColor !== 'rgba(0,0,0,0.1)';
}
var plugin_colors = {
    id: 'colors',
    defaults: {
        enabled: true,
        forceOverride: false
    },
    beforeLayout(chart, _args, options) {
        if (!options.enabled) {
            return;
        }
        const { data: { datasets }, options: chartOptions } = chart.config;
        const { elements } = chartOptions;
        const containsColorDefenition = containsColorsDefinitions(datasets) || containsColorsDefinition(chartOptions) || elements && containsColorsDefinitions(elements) || containsDefaultColorsDefenitions();
        if (!options.forceOverride && containsColorDefenition) {
            return;
        }
        const colorizer = getColorizer(chart);
        datasets.forEach(colorizer);
    }
};

function lttbDecimation(data, start, count, availableWidth, options) {
    const samples = options.samples || availableWidth;
    if (samples >= count) {
        return data.slice(start, start + count);
    }
    const decimated = [];
    const bucketWidth = (count - 2) / (samples - 2);
    let sampledIndex = 0;
    const endIndex = start + count - 1;
    let a = start;
    let i, maxAreaPoint, maxArea, area, nextA;
    decimated[sampledIndex++] = data[a];
    for (i = 0; i < samples - 2; i++) {
        let avgX = 0;
        let avgY = 0;
        let j;
        const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
        const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
        const avgRangeLength = avgRangeEnd - avgRangeStart;
        for (j = avgRangeStart; j < avgRangeEnd; j++) {
            avgX += data[j].x;
            avgY += data[j].y;
        }
        avgX /= avgRangeLength;
        avgY /= avgRangeLength;
        const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
        const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
        const { x: pointAx, y: pointAy } = data[a];
        maxArea = area = -1;
        for (j = rangeOffs; j < rangeTo; j++) {
            area = 0.5 * Math.abs((pointAx - avgX) * (data[j].y - pointAy) - (pointAx - data[j].x) * (avgY - pointAy));
            if (area > maxArea) {
                maxArea = area;
                maxAreaPoint = data[j];
                nextA = j;
            }
        }
        decimated[sampledIndex++] = maxAreaPoint;
        a = nextA;
    }
    decimated[sampledIndex++] = data[endIndex];
    return decimated;
}
function minMaxDecimation(data, start, count, availableWidth) {
    let avgX = 0;
    let countX = 0;
    let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
    const decimated = [];
    const endIndex = start + count - 1;
    const xMin = data[start].x;
    const xMax = data[endIndex].x;
    const dx = xMax - xMin;
    for (i = start; i < start + count; ++i) {
        point = data[i];
        x = (point.x - xMin) / dx * availableWidth;
        y = point.y;
        const truncX = x | 0;
        if (truncX === prevX) {
            if (y < minY) {
                minY = y;
                minIndex = i;
            } else if (y > maxY) {
                maxY = y;
                maxIndex = i;
            }
            avgX = (countX * avgX + point.x) / ++countX;
        } else {
            const lastIndex = i - 1;
            if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
                const intermediateIndex1 = Math.min(minIndex, maxIndex);
                const intermediateIndex2 = Math.max(minIndex, maxIndex);
                if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
                    decimated.push({
                        ...data[intermediateIndex1],
                        x: avgX
                    });
                }
                if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
                    decimated.push({
                        ...data[intermediateIndex2],
                        x: avgX
                    });
                }
            }
            if (i > 0 && lastIndex !== startIndex) {
                decimated.push(data[lastIndex]);
            }
            decimated.push(point);
            prevX = truncX;
            countX = 0;
            minY = maxY = y;
            minIndex = maxIndex = startIndex = i;
        }
    }
    return decimated;
}
function cleanDecimatedDataset(dataset) {
    if (dataset._decimated) {
        const data = dataset._data;
        delete dataset._decimated;
        delete dataset._data;
        Object.defineProperty(dataset, 'data', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: data
        });
    }
}
function cleanDecimatedData(chart) {
    chart.data.datasets.forEach((dataset) => {
        cleanDecimatedDataset(dataset);
    });
}
function getStartAndCountOfVisiblePointsSimplified(meta, points) {
    const pointCount = points.length;
    let start = 0;
    let count;
    const { iScale } = meta;
    const { min, max, minDefined, maxDefined } = iScale.getUserBounds();
    if (minDefined) {
        start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
    }
    if (maxDefined) {
        count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
    } else {
        count = pointCount - start;
    }
    return {
        start,
        count
    };
}
var plugin_decimation = {
    id: 'decimation',
    defaults: {
        algorithm: 'min-max',
        enabled: false
    },
    beforeElementsUpdate: (chart, args, options) => {
        if (!options.enabled) {
            cleanDecimatedData(chart);
            return;
        }
        const availableWidth = chart.width;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
            const { _data, indexAxis } = dataset;
            const meta = chart.getDatasetMeta(datasetIndex);
            const data = _data || dataset.data;
            if (resolve([
                indexAxis,
                chart.options.indexAxis
            ]) === 'y') {
                return;
            }
            if (!meta.controller.supportsDecimation) {
                return;
            }
            const xAxis = chart.scales[meta.xAxisID];
            if (xAxis.type !== 'linear' && xAxis.type !== 'time') {
                return;
            }
            if (chart.options.parsing) {
                return;
            }
            let { start, count } = getStartAndCountOfVisiblePointsSimplified(meta, data);
            const threshold = options.threshold || 4 * availableWidth;
            if (count <= threshold) {
                cleanDecimatedDataset(dataset);
                return;
            }
            if (isNullOrUndef(_data)) {
                dataset._data = data;
                delete dataset.data;
                Object.defineProperty(dataset, 'data', {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return this._decimated;
                    },
                    set: function (d) {
                        this._data = d;
                    }
                });
            }
            let decimated;
            switch (options.algorithm) {
                case 'lttb':
                    decimated = lttbDecimation(data, start, count, availableWidth, options);
                    break;
                case 'min-max':
                    decimated = minMaxDecimation(data, start, count, availableWidth);
                    break;
                default:
                    throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
            }
            dataset._decimated = decimated;
        });
    },
    destroy(chart) {
        cleanDecimatedData(chart);
    }
};

function _segments(line, target, property) {
    const segments = line.segments;
    const points = line.points;
    const tpoints = target.points;
    const parts = [];
    for (const segment of segments) {
        let { start, end } = segment;
        end = _findSegmentEnd(start, end, points);
        const bounds = _getBounds(property, points[start], points[end], segment.loop);
        if (!target.segments) {
            parts.push({
                source: segment,
                target: bounds,
                start: points[start],
                end: points[end]
            });
            continue;
        }
        const targetSegments = _boundSegments(target, bounds);
        for (const tgt of targetSegments) {
            const subBounds = _getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
            const fillSources = _boundSegment(segment, points, subBounds);
            for (const fillSource of fillSources) {
                parts.push({
                    source: fillSource,
                    target: tgt,
                    start: {
                        [property]: _getEdge(bounds, subBounds, 'start', Math.max)
                    },
                    end: {
                        [property]: _getEdge(bounds, subBounds, 'end', Math.min)
                    }
                });
            }
        }
    }
    return parts;
}
function _getBounds(property, first, last, loop) {
    if (loop) {
        return;
    }
    let start = first[property];
    let end = last[property];
    if (property === 'angle') {
        start = _normalizeAngle(start);
        end = _normalizeAngle(end);
    }
    return {
        property,
        start,
        end
    };
}
function _pointsFromSegments(boundary, line) {
    const { x = null, y = null } = boundary || {};
    const linePoints = line.points;
    const points = [];
    line.segments.forEach(({ start, end }) => {
        end = _findSegmentEnd(start, end, linePoints);
        const first = linePoints[start];
        const last = linePoints[end];
        if (y !== null) {
            points.push({
                x: first.x,
                y
            });
            points.push({
                x: last.x,
                y
            });
        } else if (x !== null) {
            points.push({
                x,
                y: first.y
            });
            points.push({
                x,
                y: last.y
            });
        }
    });
    return points;
}
function _findSegmentEnd(start, end, points) {
    for (; end > start; end--) {
        const point = points[end];
        if (!isNaN(point.x) && !isNaN(point.y)) {
            break;
        }
    }
    return end;
}
function _getEdge(a, b, prop, fn) {
    if (a && b) {
        return fn(a[prop], b[prop]);
    }
    return a ? a[prop] : b ? b[prop] : 0;
}

function _createBoundaryLine(boundary, line) {
    let points = [];
    let _loop = false;
    if (isArray(boundary)) {
        _loop = true;
        points = boundary;
    } else {
        points = _pointsFromSegments(boundary, line);
    }
    return points.length ? new LineElement({
        points,
        options: {
            tension: 0
        },
        _loop,
        _fullLoop: _loop
    }) : null;
}
function _shouldApplyFill(source) {
    return source && source.fill !== false;
}

function _resolveTarget(sources, index, propagate) {
    const source = sources[index];
    let fill = source.fill;
    const visited = [
        index
    ];
    let target;
    if (!propagate) {
        return fill;
    }
    while (fill !== false && visited.indexOf(fill) === -1) {
        if (!isNumberFinite(fill)) {
            return fill;
        }
        target = sources[fill];
        if (!target) {
            return false;
        }
        if (target.visible) {
            return fill;
        }
        visited.push(fill);
        fill = target.fill;
    }
    return false;
}
function _decodeFill(line, index, count) {
    const fill = parseFillOption(line);
    if (isObject(fill)) {
        return isNaN(fill.value) ? false : fill;
    }
    let target = parseFloat(fill);
    if (isNumberFinite(target) && Math.floor(target) === target) {
        return decodeTargetIndex(fill[0], index, target, count);
    }
    return [
        'origin',
        'start',
        'end',
        'stack',
        'shape'
    ].indexOf(fill) >= 0 && fill;
}
function decodeTargetIndex(firstCh, index, target, count) {
    if (firstCh === '-' || firstCh === '+') {
        target = index + target;
    }
    if (target === index || target < 0 || target >= count) {
        return false;
    }
    return target;
}
function _getTargetPixel(fill, scale) {
    let pixel = null;
    if (fill === 'start') {
        pixel = scale.bottom;
    } else if (fill === 'end') {
        pixel = scale.top;
    } else if (isObject(fill)) {
        pixel = scale.getPixelForValue(fill.value);
    } else if (scale.getBasePixel) {
        pixel = scale.getBasePixel();
    }
    return pixel;
}
function _getTargetValue(fill, scale, startValue) {
    let value;
    if (fill === 'start') {
        value = startValue;
    } else if (fill === 'end') {
        value = scale.options.reverse ? scale.min : scale.max;
    } else if (isObject(fill)) {
        value = fill.value;
    } else {
        value = scale.getBaseValue();
    }
    return value;
}
function parseFillOption(line) {
    const options = line.options;
    const fillOption = options.fill;
    let fill = valueOrDefault(fillOption && fillOption.target, fillOption);
    if (fill === undefined) {
        fill = !!options.backgroundColor;
    }
    if (fill === false || fill === null) {
        return false;
    }
    if (fill === true) {
        return 'origin';
    }
    return fill;
}

function _buildStackLine(source) {
    const { scale, index, line } = source;
    const points = [];
    const segments = line.segments;
    const sourcePoints = line.points;
    const linesBelow = getLinesBelow(scale, index);
    linesBelow.push(_createBoundaryLine({
        x: null,
        y: scale.bottom
    }, line));
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        for (let j = segment.start; j <= segment.end; j++) {
            addPointsBelow(points, sourcePoints[j], linesBelow);
        }
    }
    return new LineElement({
        points,
        options: {}
    });
}
function getLinesBelow(scale, index) {
    const below = [];
    const metas = scale.getMatchingVisibleMetas('line');
    for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        if (meta.index === index) {
            break;
        }
        if (!meta.hidden) {
            below.unshift(meta.dataset);
        }
    }
    return below;
}
function addPointsBelow(points, sourcePoint, linesBelow) {
    const postponed = [];
    for (let j = 0; j < linesBelow.length; j++) {
        const line = linesBelow[j];
        const { first, last, point } = findPoint(line, sourcePoint, 'x');
        if (!point || first && last) {
            continue;
        }
        if (first) {
            postponed.unshift(point);
        } else {
            points.push(point);
            if (!last) {
                break;
            }
        }
    }
    points.push(...postponed);
}
function findPoint(line, sourcePoint, property) {
    const point = line.interpolate(sourcePoint, property);
    if (!point) {
        return {};
    }
    const pointValue = point[property];
    const segments = line.segments;
    const linePoints = line.points;
    let first = false;
    let last = false;
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const firstValue = linePoints[segment.start][property];
        const lastValue = linePoints[segment.end][property];
        if (_isBetween(pointValue, firstValue, lastValue)) {
            first = pointValue === firstValue;
            last = pointValue === lastValue;
            break;
        }
    }
    return {
        first,
        last,
        point
    };
}

class simpleArc {
    constructor(opts) {
        this.x = opts.x;
        this.y = opts.y;
        this.radius = opts.radius;
    }
    pathSegment(ctx, bounds, opts) {
        const { x, y, radius } = this;
        bounds = bounds || {
            start: 0,
            end: TAU
        };
        ctx.arc(x, y, radius, bounds.end, bounds.start, true);
        return !opts.bounds;
    }
    interpolate(point) {
        const { x, y, radius } = this;
        const angle = point.angle;
        return {
            x: x + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius,
            angle
        };
    }
}

function _getTarget(source) {
    const { chart, fill, line } = source;
    if (isNumberFinite(fill)) {
        return getLineByIndex(chart, fill);
    }
    if (fill === 'stack') {
        return _buildStackLine(source);
    }
    if (fill === 'shape') {
        return true;
    }
    const boundary = computeBoundary(source);
    if (boundary instanceof simpleArc) {
        return boundary;
    }
    return _createBoundaryLine(boundary, line);
}
function getLineByIndex(chart, index) {
    const meta = chart.getDatasetMeta(index);
    const visible = meta && chart.isDatasetVisible(index);
    return visible ? meta.dataset : null;
}
function computeBoundary(source) {
    const scale = source.scale || {};
    if (scale.getPointPositionForValue) {
        return computeCircularBoundary(source);
    }
    return computeLinearBoundary(source);
}
function computeLinearBoundary(source) {
    const { scale = {}, fill } = source;
    const pixel = _getTargetPixel(fill, scale);
    if (isNumberFinite(pixel)) {
        const horizontal = scale.isHorizontal();
        return {
            x: horizontal ? pixel : null,
            y: horizontal ? null : pixel
        };
    }
    return null;
}
function computeCircularBoundary(source) {
    const { scale, fill } = source;
    const options = scale.options;
    const length = scale.getLabels().length;
    const start = options.reverse ? scale.max : scale.min;
    const value = _getTargetValue(fill, scale, start);
    const target = [];
    if (options.grid.circular) {
        const center = scale.getPointPositionForValue(0, start);
        return new simpleArc({
            x: center.x,
            y: center.y,
            radius: scale.getDistanceFromCenterForValue(value)
        });
    }
    for (let i = 0; i < length; ++i) {
        target.push(scale.getPointPositionForValue(i, value));
    }
    return target;
}

function _drawfill(ctx, source, area) {
    const target = _getTarget(source);
    const { chart, index, line, scale, axis } = source;
    const lineOpts = line.options;
    const fillOption = lineOpts.fill;
    const color = lineOpts.backgroundColor;
    const { above = color, below = color } = fillOption || {};
    const meta = chart.getDatasetMeta(index);
    const clip = getDatasetClipArea(chart, meta);
    if (target && line.points.length) {
        clipArea(ctx, area);
        doFill(ctx, {
            line,
            target,
            above,
            below,
            area,
            scale,
            axis,
            clip
        });
        unclipArea(ctx);
    }
}
function doFill(ctx, cfg) {
    const { line, target, above, below, area, scale, clip } = cfg;
    const property = line._loop ? 'angle' : cfg.axis;
    ctx.save();
    let fillColor = below;
    if (below !== above) {
        if (property === 'x') {
            clipVertical(ctx, target, area.top);
            fill(ctx, {
                line,
                target,
                color: above,
                scale,
                property,
                clip
            });
            ctx.restore();
            ctx.save();
            clipVertical(ctx, target, area.bottom);
        } else if (property === 'y') {
            clipHorizontal(ctx, target, area.left);
            fill(ctx, {
                line,
                target,
                color: below,
                scale,
                property,
                clip
            });
            ctx.restore();
            ctx.save();
            clipHorizontal(ctx, target, area.right);
            fillColor = above;
        }
    }
    fill(ctx, {
        line,
        target,
        color: fillColor,
        scale,
        property,
        clip
    });
    ctx.restore();
}
function clipVertical(ctx, target, clipY) {
    const { segments, points } = target;
    let first = true;
    let lineLoop = false;
    ctx.beginPath();
    for (const segment of segments) {
        const { start, end } = segment;
        const firstPoint = points[start];
        const lastPoint = points[_findSegmentEnd(start, end, points)];
        if (first) {
            ctx.moveTo(firstPoint.x, firstPoint.y);
            first = false;
        } else {
            ctx.lineTo(firstPoint.x, clipY);
            ctx.lineTo(firstPoint.x, firstPoint.y);
        }
        lineLoop = !!target.pathSegment(ctx, segment, {
            move: lineLoop
        });
        if (lineLoop) {
            ctx.closePath();
        } else {
            ctx.lineTo(lastPoint.x, clipY);
        }
    }
    ctx.lineTo(target.first().x, clipY);
    ctx.closePath();
    ctx.clip();
}
function clipHorizontal(ctx, target, clipX) {
    const { segments, points } = target;
    let first = true;
    let lineLoop = false;
    ctx.beginPath();
    for (const segment of segments) {
        const { start, end } = segment;
        const firstPoint = points[start];
        const lastPoint = points[_findSegmentEnd(start, end, points)];
        if (first) {
            ctx.moveTo(firstPoint.x, firstPoint.y);
            first = false;
        } else {
            ctx.lineTo(clipX, firstPoint.y);
            ctx.lineTo(firstPoint.x, firstPoint.y);
        }
        lineLoop = !!target.pathSegment(ctx, segment, {
            move: lineLoop
        });
        if (lineLoop) {
            ctx.closePath();
        } else {
            ctx.lineTo(clipX, lastPoint.y);
        }
    }
    ctx.lineTo(clipX, target.first().y);
    ctx.closePath();
    ctx.clip();
}
function fill(ctx, cfg) {
    const { line, target, property, color, scale, clip } = cfg;
    const segments = _segments(line, target, property);
    for (const { source: src, target: tgt, start, end } of segments) {
        const { style: { backgroundColor = color } = {} } = src;
        const notShape = target !== true;
        ctx.save();
        ctx.fillStyle = backgroundColor;
        clipBounds(ctx, scale, clip, notShape && _getBounds(property, start, end));
        ctx.beginPath();
        const lineLoop = !!line.pathSegment(ctx, src);
        let loop;
        if (notShape) {
            if (lineLoop) {
                ctx.closePath();
            } else {
                interpolatedLineTo(ctx, target, end, property);
            }
            const targetLoop = !!target.pathSegment(ctx, tgt, {
                move: lineLoop,
                reverse: true
            });
            loop = lineLoop && targetLoop;
            if (!loop) {
                interpolatedLineTo(ctx, target, start, property);
            }
        }
        ctx.closePath();
        ctx.fill(loop ? 'evenodd' : 'nonzero');
        ctx.restore();
    }
}
function clipBounds(ctx, scale, clip, bounds) {
    const chartArea = scale.chart.chartArea;
    const { property, start, end } = bounds || {};
    if (property === 'x' || property === 'y') {
        let left, top, right, bottom;
        if (property === 'x') {
            left = start;
            top = chartArea.top;
            right = end;
            bottom = chartArea.bottom;
        } else {
            left = chartArea.left;
            top = start;
            right = chartArea.right;
            bottom = end;
        }
        ctx.beginPath();
        if (clip) {
            left = Math.max(left, clip.left);
            right = Math.min(right, clip.right);
            top = Math.max(top, clip.top);
            bottom = Math.min(bottom, clip.bottom);
        }
        ctx.rect(left, top, right - left, bottom - top);
        ctx.clip();
    }
}
function interpolatedLineTo(ctx, target, point, property) {
    const interpolatedPoint = target.interpolate(point, property);
    if (interpolatedPoint) {
        ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
    }
}

var index = {
    id: 'filler',
    afterDatasetsUpdate(chart, _args, options) {
        const count = (chart.data.datasets || []).length;
        const sources = [];
        let meta, i, line, source;
        for (i = 0; i < count; ++i) {
            meta = chart.getDatasetMeta(i);
            line = meta.dataset;
            source = null;
            if (line && line.options && line instanceof LineElement) {
                source = {
                    visible: chart.isDatasetVisible(i),
                    index: i,
                    fill: _decodeFill(line, i, count),
                    chart,
                    axis: meta.controller.options.indexAxis,
                    scale: meta.vScale,
                    line
                };
            }
            meta.$filler = source;
            sources.push(source);
        }
        for (i = 0; i < count; ++i) {
            source = sources[i];
            if (!source || source.fill === false) {
                continue;
            }
            source.fill = _resolveTarget(sources, i, options.propagate);
        }
    },
    beforeDraw(chart, _args, options) {
        const draw = options.drawTime === 'beforeDraw';
        const metasets = chart.getSortedVisibleDatasetMetas();
        const area = chart.chartArea;
        for (let i = metasets.length - 1; i >= 0; --i) {
            const source = metasets[i].$filler;
            if (!source) {
                continue;
            }
            source.line.updateControlPoints(area, source.axis);
            if (draw && source.fill) {
                _drawfill(chart.ctx, source, area);
            }
        }
    },
    beforeDatasetsDraw(chart, _args, options) {
        if (options.drawTime !== 'beforeDatasetsDraw') {
            return;
        }
        const metasets = chart.getSortedVisibleDatasetMetas();
        for (let i = metasets.length - 1; i >= 0; --i) {
            const source = metasets[i].$filler;
            if (_shouldApplyFill(source)) {
                _drawfill(chart.ctx, source, chart.chartArea);
            }
        }
    },
    beforeDatasetDraw(chart, args, options) {
        const source = args.meta.$filler;
        if (!_shouldApplyFill(source) || options.drawTime !== 'beforeDatasetDraw') {
            return;
        }
        _drawfill(chart.ctx, source, chart.chartArea);
    },
    defaults: {
        propagate: true,
        drawTime: 'beforeDatasetDraw'
    }
};

const getBoxSize = (labelOpts, fontSize) => {
    let { boxHeight = fontSize, boxWidth = fontSize } = labelOpts;
    if (labelOpts.usePointStyle) {
        boxHeight = Math.min(boxHeight, fontSize);
        boxWidth = labelOpts.pointStyleWidth || Math.min(boxWidth, fontSize);
    }
    return {
        boxWidth,
        boxHeight,
        itemHeight: Math.max(fontSize, boxHeight)
    };
};
const itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
class Legend extends Element {
    constructor(config) {
        super();
        this._added = false;
        this.legendHitBoxes = [];
        this._hoveredItem = null;
        this.doughnutMode = false;
        this.chart = config.chart;
        this.options = config.options;
        this.ctx = config.ctx;
        this.legendItems = undefined;
        this.columnSizes = undefined;
        this.lineWidths = undefined;
        this.maxHeight = undefined;
        this.maxWidth = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.height = undefined;
        this.width = undefined;
        this._margins = undefined;
        this.position = undefined;
        this.weight = undefined;
        this.fullSize = undefined;
    }
    update(maxWidth, maxHeight, margins) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins;
        this.setDimensions();
        this.buildLabels();
        this.fit();
    }
    setDimensions() {
        if (this.isHorizontal()) {
            this.width = this.maxWidth;
            this.left = this._margins.left;
            this.right = this.width;
        } else {
            this.height = this.maxHeight;
            this.top = this._margins.top;
            this.bottom = this.height;
        }
    }
    buildLabels() {
        const labelOpts = this.options.labels || {};
        let legendItems = callback(labelOpts.generateLabels, [
            this.chart
        ], this) || [];
        if (labelOpts.filter) {
            legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
        }
        if (labelOpts.sort) {
            legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
        }
        if (this.options.reverse) {
            legendItems.reverse();
        }
        this.legendItems = legendItems;
    }
    fit() {
        const { options, ctx } = this;
        if (!options.display) {
            this.width = this.height = 0;
            return;
        }
        const labelOpts = options.labels;
        const labelFont = toFont(labelOpts.font);
        const fontSize = labelFont.size;
        const titleHeight = this._computeTitleHeight();
        const { boxWidth, itemHeight } = getBoxSize(labelOpts, fontSize);
        let width, height;
        ctx.font = labelFont.string;
        if (this.isHorizontal()) {
            width = this.maxWidth;
            height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
        } else {
            height = this.maxHeight;
            width = this._fitCols(titleHeight, labelFont, boxWidth, itemHeight) + 10;
        }
        this.width = Math.min(width, options.maxWidth || this.maxWidth);
        this.height = Math.min(height, options.maxHeight || this.maxHeight);
    }
    _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
        const { ctx, maxWidth, options: { labels: { padding } } } = this;
        const hitboxes = this.legendHitBoxes = [];
        const lineWidths = this.lineWidths = [
            0
        ];
        const lineHeight = itemHeight + padding;
        let totalHeight = titleHeight;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        let row = -1;
        let top = -lineHeight;
        this.legendItems.forEach((legendItem, i) => {
            const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;
            if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
                totalHeight += lineHeight;
                lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
                top += lineHeight;
                row++;
            }
            hitboxes[i] = {
                left: 0,
                top,
                row,
                width: itemWidth,
                height: itemHeight
            };
            lineWidths[lineWidths.length - 1] += itemWidth + padding;
        });
        return totalHeight;
    }
    _fitCols(titleHeight, labelFont, boxWidth, _itemHeight) {
        const { ctx, maxHeight, options: { labels: { padding } } } = this;
        const hitboxes = this.legendHitBoxes = [];
        const columnSizes = this.columnSizes = [];
        const heightLimit = maxHeight - titleHeight;
        let totalWidth = padding;
        let currentColWidth = 0;
        let currentColHeight = 0;
        let left = 0;
        let col = 0;
        this.legendItems.forEach((legendItem, i) => {
            const { itemWidth, itemHeight } = calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight);
            if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
                totalWidth += currentColWidth + padding;
                columnSizes.push({
                    width: currentColWidth,
                    height: currentColHeight
                });
                left += currentColWidth + padding;
                col++;
                currentColWidth = currentColHeight = 0;
            }
            hitboxes[i] = {
                left,
                top: currentColHeight,
                col,
                width: itemWidth,
                height: itemHeight
            };
            currentColWidth = Math.max(currentColWidth, itemWidth);
            currentColHeight += itemHeight + padding;
        });
        totalWidth += currentColWidth;
        columnSizes.push({
            width: currentColWidth,
            height: currentColHeight
        });
        return totalWidth;
    }
    adjustHitBoxes() {
        if (!this.options.display) {
            return;
        }
        const titleHeight = this._computeTitleHeight();
        const { legendHitBoxes: hitboxes, options: { align, labels: { padding }, rtl } } = this;
        const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
        if (this.isHorizontal()) {
            let row = 0;
            let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
            for (const hitbox of hitboxes) {
                if (row !== hitbox.row) {
                    row = hitbox.row;
                    left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
                }
                hitbox.top += this.top + titleHeight + padding;
                hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
                left += hitbox.width + padding;
            }
        } else {
            let col = 0;
            let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
            for (const hitbox of hitboxes) {
                if (hitbox.col !== col) {
                    col = hitbox.col;
                    top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
                }
                hitbox.top = top;
                hitbox.left += this.left + padding;
                hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
                top += hitbox.height + padding;
            }
        }
    }
    isHorizontal() {
        return this.options.position === 'top' || this.options.position === 'bottom';
    }
    draw() {
        if (this.options.display) {
            const ctx = this.ctx;
            clipArea(ctx, this);
            this._draw();
            unclipArea(ctx);
        }
    }
    _draw() {
        const { options: opts, columnSizes, lineWidths, ctx } = this;
        const { align, labels: labelOpts } = opts;
        const defaultColor = defaults.color;
        const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        const labelFont = toFont(labelOpts.font);
        const { padding } = labelOpts;
        const fontSize = labelFont.size;
        const halfFontSize = fontSize / 2;
        let cursor;
        this.drawTitle();
        ctx.textAlign = rtlHelper.textAlign('left');
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 0.5;
        ctx.font = labelFont.string;
        const { boxWidth, boxHeight, itemHeight } = getBoxSize(labelOpts, fontSize);
        const drawLegendBox = function (x, y, legendItem) {
            if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
                return;
            }
            ctx.save();
            const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
            ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
            ctx.lineCap = valueOrDefault(legendItem.lineCap, 'butt');
            ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
            ctx.lineJoin = valueOrDefault(legendItem.lineJoin, 'miter');
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
            ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
            if (labelOpts.usePointStyle) {
                const drawOptions = {
                    radius: boxHeight * Math.SQRT2 / 2,
                    pointStyle: legendItem.pointStyle,
                    rotation: legendItem.rotation,
                    borderWidth: lineWidth
                };
                const centerX = rtlHelper.xPlus(x, boxWidth / 2);
                const centerY = y + halfFontSize;
                drawPointLegend(ctx, drawOptions, centerX, centerY, labelOpts.pointStyleWidth && boxWidth);
            } else {
                const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
                const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
                const borderRadius = toTRBLCorners(legendItem.borderRadius);
                ctx.beginPath();
                if (Object.values(borderRadius).some((v) => v !== 0)) {
                    addRoundedRectPath(ctx, {
                        x: xBoxLeft,
                        y: yBoxTop,
                        w: boxWidth,
                        h: boxHeight,
                        radius: borderRadius
                    });
                } else {
                    ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
                }
                ctx.fill();
                if (lineWidth !== 0) {
                    ctx.stroke();
                }
            }
            ctx.restore();
        };
        const fillText = function (x, y, legendItem) {
            renderText(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
                strikethrough: legendItem.hidden,
                textAlign: rtlHelper.textAlign(legendItem.textAlign)
            });
        };
        const isHorizontal = this.isHorizontal();
        const titleHeight = this._computeTitleHeight();
        if (isHorizontal) {
            cursor = {
                x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
                y: this.top + padding + titleHeight,
                line: 0
            };
        } else {
            cursor = {
                x: this.left + padding,
                y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
                line: 0
            };
        }
        overrideTextDirection(this.ctx, opts.textDirection);
        const lineHeight = itemHeight + padding;
        this.legendItems.forEach((legendItem, i) => {
            ctx.strokeStyle = legendItem.fontColor;
            ctx.fillStyle = legendItem.fontColor;
            const textWidth = ctx.measureText(legendItem.text).width;
            const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
            const width = boxWidth + halfFontSize + textWidth;
            let x = cursor.x;
            let y = cursor.y;
            rtlHelper.setWidth(this.width);
            if (isHorizontal) {
                if (i > 0 && x + width + padding > this.right) {
                    y = cursor.y += lineHeight;
                    cursor.line++;
                    x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
                }
            } else if (i > 0 && y + lineHeight > this.bottom) {
                x = cursor.x = x + columnSizes[cursor.line].width + padding;
                cursor.line++;
                y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
            }
            const realX = rtlHelper.x(x);
            drawLegendBox(realX, y, legendItem);
            x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
            fillText(rtlHelper.x(x), y, legendItem);
            if (isHorizontal) {
                cursor.x += width + padding;
            } else if (typeof legendItem.text !== 'string') {
                const fontLineHeight = labelFont.lineHeight;
                cursor.y += calculateLegendItemHeight(legendItem, fontLineHeight) + padding;
            } else {
                cursor.y += lineHeight;
            }
        });
        restoreTextDirection(this.ctx, opts.textDirection);
    }
    drawTitle() {
        const opts = this.options;
        const titleOpts = opts.title;
        const titleFont = toFont(titleOpts.font);
        const titlePadding = toPadding(titleOpts.padding);
        if (!titleOpts.display) {
            return;
        }
        const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        const ctx = this.ctx;
        const position = titleOpts.position;
        const halfFontSize = titleFont.size / 2;
        const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
        let y;
        let left = this.left;
        let maxWidth = this.width;
        if (this.isHorizontal()) {
            maxWidth = Math.max(...this.lineWidths);
            y = this.top + topPaddingPlusHalfFontSize;
            left = _alignStartEnd(opts.align, left, this.right - maxWidth);
        } else {
            const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
            y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
        }
        const x = _alignStartEnd(position, left, left + maxWidth);
        ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = titleOpts.color;
        ctx.fillStyle = titleOpts.color;
        ctx.font = titleFont.string;
        renderText(ctx, titleOpts.text, x, y, titleFont);
    }
    _computeTitleHeight() {
        const titleOpts = this.options.title;
        const titleFont = toFont(titleOpts.font);
        const titlePadding = toPadding(titleOpts.padding);
        return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
    }
    _getLegendItemAt(x, y) {
        let i, hitBox, lh;
        if (_isBetween(x, this.left, this.right) && _isBetween(y, this.top, this.bottom)) {
            lh = this.legendHitBoxes;
            for (i = 0; i < lh.length; ++i) {
                hitBox = lh[i];
                if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width) && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
                    return this.legendItems[i];
                }
            }
        }
        return null;
    }
    handleEvent(e) {
        const opts = this.options;
        if (!isListened(e.type, opts)) {
            return;
        }
        const hoveredItem = this._getLegendItemAt(e.x, e.y);
        if (e.type === 'mousemove' || e.type === 'mouseout') {
            const previous = this._hoveredItem;
            const sameItem = itemsEqual(previous, hoveredItem);
            if (previous && !sameItem) {
                callback(opts.onLeave, [
                    e,
                    previous,
                    this
                ], this);
            }
            this._hoveredItem = hoveredItem;
            if (hoveredItem && !sameItem) {
                callback(opts.onHover, [
                    e,
                    hoveredItem,
                    this
                ], this);
            }
        } else if (hoveredItem) {
            callback(opts.onClick, [
                e,
                hoveredItem,
                this
            ], this);
        }
    }
}
function calculateItemSize(boxWidth, labelFont, ctx, legendItem, _itemHeight) {
    const itemWidth = calculateItemWidth(legendItem, boxWidth, labelFont, ctx);
    const itemHeight = calculateItemHeight(_itemHeight, legendItem, labelFont.lineHeight);
    return {
        itemWidth,
        itemHeight
    };
}
function calculateItemWidth(legendItem, boxWidth, labelFont, ctx) {
    let legendItemText = legendItem.text;
    if (legendItemText && typeof legendItemText !== 'string') {
        legendItemText = legendItemText.reduce((a, b) => a.length > b.length ? a : b);
    }
    return boxWidth + labelFont.size / 2 + ctx.measureText(legendItemText).width;
}
function calculateItemHeight(_itemHeight, legendItem, fontLineHeight) {
    let itemHeight = _itemHeight;
    if (typeof legendItem.text !== 'string') {
        itemHeight = calculateLegendItemHeight(legendItem, fontLineHeight);
    }
    return itemHeight;
}
function calculateLegendItemHeight(legendItem, fontLineHeight) {
    const labelHeight = legendItem.text ? legendItem.text.length : 0;
    return fontLineHeight * labelHeight;
}
function isListened(type, opts) {
    if ((type === 'mousemove' || type === 'mouseout') && (opts.onHover || opts.onLeave)) {
        return true;
    }
    if (opts.onClick && (type === 'click' || type === 'mouseup')) {
        return true;
    }
    return false;
}
var plugin_legend = {
    id: 'legend',
    _element: Legend,
    start(chart, _args, options) {
        const legend = chart.legend = new Legend({
            ctx: chart.ctx,
            options,
            chart
        });
        layouts.configure(chart, legend, options);
        layouts.addBox(chart, legend);
    },
    stop(chart) {
        layouts.removeBox(chart, chart.legend);
        delete chart.legend;
    },
    beforeUpdate(chart, _args, options) {
        const legend = chart.legend;
        layouts.configure(chart, legend, options);
        legend.options = options;
    },
    afterUpdate(chart) {
        const legend = chart.legend;
        legend.buildLabels();
        legend.adjustHitBoxes();
    },
    afterEvent(chart, args) {
        if (!args.replay) {
            chart.legend.handleEvent(args.event);
        }
    },
    defaults: {
        display: true,
        position: 'top',
        align: 'center',
        fullSize: true,
        reverse: false,
        weight: 1000,
        onClick(e, legendItem, legend) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            if (ci.isDatasetVisible(index)) {
                ci.hide(index);
                legendItem.hidden = true;
            } else {
                ci.show(index);
                legendItem.hidden = false;
            }
        },
        onHover: null,
        onLeave: null,
        labels: {
            color: (ctx) => ctx.chart.options.color,
            boxWidth: 40,
            padding: 10,
            generateLabels(chart) {
                const datasets = chart.data.datasets;
                const { labels: { usePointStyle, pointStyle, textAlign, color, useBorderRadius, borderRadius } } = chart.legend.options;
                return chart._getSortedDatasetMetas().map((meta) => {
                    const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
                    const borderWidth = toPadding(style.borderWidth);
                    return {
                        text: datasets[meta.index].label,
                        fillStyle: style.backgroundColor,
                        fontColor: color,
                        hidden: !meta.visible,
                        lineCap: style.borderCapStyle,
                        lineDash: style.borderDash,
                        lineDashOffset: style.borderDashOffset,
                        lineJoin: style.borderJoinStyle,
                        lineWidth: (borderWidth.width + borderWidth.height) / 4,
                        strokeStyle: style.borderColor,
                        pointStyle: pointStyle || style.pointStyle,
                        rotation: style.rotation,
                        textAlign: textAlign || style.textAlign,
                        borderRadius: useBorderRadius && (borderRadius || style.borderRadius),
                        datasetIndex: meta.index
                    };
                }, this);
            }
        },
        title: {
            color: (ctx) => ctx.chart.options.color,
            display: false,
            position: 'center',
            text: ''
        }
    },
    descriptors: {
        _scriptable: (name) => !name.startsWith('on'),
        labels: {
            _scriptable: (name) => ![
                'generateLabels',
                'filter',
                'sort'
            ].includes(name)
        }
    }
};

class Title extends Element {
    constructor(config) {
        super();
        this.chart = config.chart;
        this.options = config.options;
        this.ctx = config.ctx;
        this._padding = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.width = undefined;
        this.height = undefined;
        this.position = undefined;
        this.weight = undefined;
        this.fullSize = undefined;
    }
    update(maxWidth, maxHeight) {
        const opts = this.options;
        this.left = 0;
        this.top = 0;
        if (!opts.display) {
            this.width = this.height = this.right = this.bottom = 0;
            return;
        }
        this.width = this.right = maxWidth;
        this.height = this.bottom = maxHeight;
        const lineCount = isArray(opts.text) ? opts.text.length : 1;
        this._padding = toPadding(opts.padding);
        const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
        if (this.isHorizontal()) {
            this.height = textSize;
        } else {
            this.width = textSize;
        }
    }
    isHorizontal() {
        const pos = this.options.position;
        return pos === 'top' || pos === 'bottom';
    }
    _drawArgs(offset) {
        const { top, left, bottom, right, options } = this;
        const align = options.align;
        let rotation = 0;
        let maxWidth, titleX, titleY;
        if (this.isHorizontal()) {
            titleX = _alignStartEnd(align, left, right);
            titleY = top + offset;
            maxWidth = right - left;
        } else {
            if (options.position === 'left') {
                titleX = left + offset;
                titleY = _alignStartEnd(align, bottom, top);
                rotation = PI * -0.5;
            } else {
                titleX = right - offset;
                titleY = _alignStartEnd(align, top, bottom);
                rotation = PI * 0.5;
            }
            maxWidth = bottom - top;
        }
        return {
            titleX,
            titleY,
            maxWidth,
            rotation
        };
    }
    draw() {
        const ctx = this.ctx;
        const opts = this.options;
        if (!opts.display) {
            return;
        }
        const fontOpts = toFont(opts.font);
        const lineHeight = fontOpts.lineHeight;
        const offset = lineHeight / 2 + this._padding.top;
        const { titleX, titleY, maxWidth, rotation } = this._drawArgs(offset);
        renderText(ctx, opts.text, 0, 0, fontOpts, {
            color: opts.color,
            maxWidth,
            rotation,
            textAlign: _toLeftRightCenter(opts.align),
            textBaseline: 'middle',
            translation: [
                titleX,
                titleY
            ]
        });
    }
}
function createTitle(chart, titleOpts) {
    const title = new Title({
        ctx: chart.ctx,
        options: titleOpts,
        chart
    });
    layouts.configure(chart, title, titleOpts);
    layouts.addBox(chart, title);
    chart.titleBlock = title;
}
var plugin_title = {
    id: 'title',
    _element: Title,
    start(chart, _args, options) {
        createTitle(chart, options);
    },
    stop(chart) {
        const titleBlock = chart.titleBlock;
        layouts.removeBox(chart, titleBlock);
        delete chart.titleBlock;
    },
    beforeUpdate(chart, _args, options) {
        const title = chart.titleBlock;
        layouts.configure(chart, title, options);
        title.options = options;
    },
    defaults: {
        align: 'center',
        display: false,
        font: {
            weight: 'bold'
        },
        fullSize: true,
        padding: 10,
        position: 'top',
        text: '',
        weight: 2000
    },
    defaultRoutes: {
        color: 'color'
    },
    descriptors: {
        _scriptable: true,
        _indexable: false
    }
};

const map = new WeakMap();
var plugin_subtitle = {
    id: 'subtitle',
    start(chart, _args, options) {
        const title = new Title({
            ctx: chart.ctx,
            options,
            chart
        });
        layouts.configure(chart, title, options);
        layouts.addBox(chart, title);
        map.set(chart, title);
    },
    stop(chart) {
        layouts.removeBox(chart, map.get(chart));
        map.delete(chart);
    },
    beforeUpdate(chart, _args, options) {
        const title = map.get(chart);
        layouts.configure(chart, title, options);
        title.options = options;
    },
    defaults: {
        align: 'center',
        display: false,
        font: {
            weight: 'normal'
        },
        fullSize: true,
        padding: 0,
        position: 'top',
        text: '',
        weight: 1500
    },
    defaultRoutes: {
        color: 'color'
    },
    descriptors: {
        _scriptable: true,
        _indexable: false
    }
};

const positioners = {
    average(items) {
        if (!items.length) {
            return false;
        }
        let i, len;
        let xSet = new Set();
        let y = 0;
        let count = 0;
        for (i = 0, len = items.length; i < len; ++i) {
            const el = items[i].element;
            if (el && el.hasValue()) {
                const pos = el.tooltipPosition();
                xSet.add(pos.x);
                y += pos.y;
                ++count;
            }
        }
        if (count === 0 || xSet.size === 0) {
            return false;
        }
        const xAverage = [
            ...xSet
        ].reduce((a, b) => a + b) / xSet.size;
        return {
            x: xAverage,
            y: y / count
        };
    },
    nearest(items, eventPosition) {
        if (!items.length) {
            return false;
        }
        let x = eventPosition.x;
        let y = eventPosition.y;
        let minDistance = Number.POSITIVE_INFINITY;
        let i, len, nearestElement;
        for (i = 0, len = items.length; i < len; ++i) {
            const el = items[i].element;
            if (el && el.hasValue()) {
                const center = el.getCenterPoint();
                const d = distanceBetweenPoints(eventPosition, center);
                if (d < minDistance) {
                    minDistance = d;
                    nearestElement = el;
                }
            }
        }
        if (nearestElement) {
            const tp = nearestElement.tooltipPosition();
            x = tp.x;
            y = tp.y;
        }
        return {
            x,
            y
        };
    }
};
function pushOrConcat(base, toPush) {
    if (toPush) {
        if (isArray(toPush)) {
            Array.prototype.push.apply(base, toPush);
        } else {
            base.push(toPush);
        }
    }
    return base;
}
function splitNewlines(str) {
    if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
        return str.split('\n');
    }
    return str;
}
function createTooltipItem(chart, item) {
    const { element, datasetIndex, index } = item;
    const controller = chart.getDatasetMeta(datasetIndex).controller;
    const { label, value } = controller.getLabelAndValue(index);
    return {
        chart,
        label,
        parsed: controller.getParsed(index),
        raw: chart.data.datasets[datasetIndex].data[index],
        formattedValue: value,
        dataset: controller.getDataset(),
        dataIndex: index,
        datasetIndex,
        element
    };
}
function getTooltipSize(tooltip, options) {
    const ctx = tooltip.chart.ctx;
    const { body, footer, title } = tooltip;
    const { boxWidth, boxHeight } = options;
    const bodyFont = toFont(options.bodyFont);
    const titleFont = toFont(options.titleFont);
    const footerFont = toFont(options.footerFont);
    const titleLineCount = title.length;
    const footerLineCount = footer.length;
    const bodyLineItemCount = body.length;
    const padding = toPadding(options.padding);
    let height = padding.height;
    let width = 0;
    let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
    combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
    if (titleLineCount) {
        height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
    }
    if (combinedBodyLength) {
        const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
        height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
    }
    if (footerLineCount) {
        height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
    }
    let widthPadding = 0;
    const maxLineWidth = function (line) {
        width = Math.max(width, ctx.measureText(line).width + widthPadding);
    };
    ctx.save();
    ctx.font = titleFont.string;
    each(tooltip.title, maxLineWidth);
    ctx.font = bodyFont.string;
    each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
    widthPadding = options.displayColors ? boxWidth + 2 + options.boxPadding : 0;
    each(body, (bodyItem) => {
        each(bodyItem.before, maxLineWidth);
        each(bodyItem.lines, maxLineWidth);
        each(bodyItem.after, maxLineWidth);
    });
    widthPadding = 0;
    ctx.font = footerFont.string;
    each(tooltip.footer, maxLineWidth);
    ctx.restore();
    width += padding.width;
    return {
        width,
        height
    };
}
function determineYAlign(chart, size) {
    const { y, height } = size;
    if (y < height / 2) {
        return 'top';
    } else if (y > chart.height - height / 2) {
        return 'bottom';
    }
    return 'center';
}
function doesNotFitWithAlign(xAlign, chart, options, size) {
    const { x, width } = size;
    const caret = options.caretSize + options.caretPadding;
    if (xAlign === 'left' && x + width + caret > chart.width) {
        return true;
    }
    if (xAlign === 'right' && x - width - caret < 0) {
        return true;
    }
}
function determineXAlign(chart, options, size, yAlign) {
    const { x, width } = size;
    const { width: chartWidth, chartArea: { left, right } } = chart;
    let xAlign = 'center';
    if (yAlign === 'center') {
        xAlign = x <= (left + right) / 2 ? 'left' : 'right';
    } else if (x <= width / 2) {
        xAlign = 'left';
    } else if (x >= chartWidth - width / 2) {
        xAlign = 'right';
    }
    if (doesNotFitWithAlign(xAlign, chart, options, size)) {
        xAlign = 'center';
    }
    return xAlign;
}
function determineAlignment(chart, options, size) {
    const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
    return {
        xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
        yAlign
    };
}
function alignX(size, xAlign) {
    let { x, width } = size;
    if (xAlign === 'right') {
        x -= width;
    } else if (xAlign === 'center') {
        x -= width / 2;
    }
    return x;
}
function alignY(size, yAlign, paddingAndSize) {
    let { y, height } = size;
    if (yAlign === 'top') {
        y += paddingAndSize;
    } else if (yAlign === 'bottom') {
        y -= height + paddingAndSize;
    } else {
        y -= height / 2;
    }
    return y;
}
function getBackgroundPoint(options, size, alignment, chart) {
    const { caretSize, caretPadding, cornerRadius } = options;
    const { xAlign, yAlign } = alignment;
    const paddingAndSize = caretSize + caretPadding;
    const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
    let x = alignX(size, xAlign);
    const y = alignY(size, yAlign, paddingAndSize);
    if (yAlign === 'center') {
        if (xAlign === 'left') {
            x += paddingAndSize;
        } else if (xAlign === 'right') {
            x -= paddingAndSize;
        }
    } else if (xAlign === 'left') {
        x -= Math.max(topLeft, bottomLeft) + caretSize;
    } else if (xAlign === 'right') {
        x += Math.max(topRight, bottomRight) + caretSize;
    }
    return {
        x: _limitValue(x, 0, chart.width - size.width),
        y: _limitValue(y, 0, chart.height - size.height)
    };
}
function getAlignedX(tooltip, align, options) {
    const padding = toPadding(options.padding);
    return align === 'center' ? tooltip.x + tooltip.width / 2 : align === 'right' ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
}
function getBeforeAfterBodyLines(callback) {
    return pushOrConcat([], splitNewlines(callback));
}
function createTooltipContext(parent, tooltip, tooltipItems) {
    return createContext(parent, {
        tooltip,
        tooltipItems,
        type: 'tooltip'
    });
}
function overrideCallbacks(callbacks, context) {
    const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
    return override ? callbacks.override(override) : callbacks;
}
const defaultCallbacks = {
    beforeTitle: noop,
    title(tooltipItems) {
        if (tooltipItems.length > 0) {
            const item = tooltipItems[0];
            const labels = item.chart.data.labels;
            const labelCount = labels ? labels.length : 0;
            if (this && this.options && this.options.mode === 'dataset') {
                return item.dataset.label || '';
            } else if (item.label) {
                return item.label;
            } else if (labelCount > 0 && item.dataIndex < labelCount) {
                return labels[item.dataIndex];
            }
        }
        return '';
    },
    afterTitle: noop,
    beforeBody: noop,
    beforeLabel: noop,
    label(tooltipItem) {
        if (this && this.options && this.options.mode === 'dataset') {
            return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
        }
        let label = tooltipItem.dataset.label || '';
        if (label) {
            label += ': ';
        }
        const value = tooltipItem.formattedValue;
        if (!isNullOrUndef(value)) {
            label += value;
        }
        return label;
    },
    labelColor(tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
        const options = meta.controller.getStyle(tooltipItem.dataIndex);
        return {
            borderColor: options.borderColor,
            backgroundColor: options.backgroundColor,
            borderWidth: options.borderWidth,
            borderDash: options.borderDash,
            borderDashOffset: options.borderDashOffset,
            borderRadius: 0
        };
    },
    labelTextColor() {
        return this.options.bodyColor;
    },
    labelPointStyle(tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
        const options = meta.controller.getStyle(tooltipItem.dataIndex);
        return {
            pointStyle: options.pointStyle,
            rotation: options.rotation
        };
    },
    afterLabel: noop,
    afterBody: noop,
    beforeFooter: noop,
    footer: noop,
    afterFooter: noop
};
function invokeCallbackWithFallback(callbacks, name, ctx, arg) {
    const result = callbacks[name].call(ctx, arg);
    if (typeof result === 'undefined') {
        return defaultCallbacks[name].call(ctx, arg);
    }
    return result;
}
class Tooltip extends Element {
    static positioners = positioners;
    constructor(config) {
        super();
        this.opacity = 0;
        this._active = [];
        this._eventPosition = undefined;
        this._size = undefined;
        this._cachedAnimations = undefined;
        this._tooltipItems = [];
        this.$animations = undefined;
        this.$context = undefined;
        this.chart = config.chart;
        this.options = config.options;
        this.dataPoints = undefined;
        this.title = undefined;
        this.beforeBody = undefined;
        this.body = undefined;
        this.afterBody = undefined;
        this.footer = undefined;
        this.xAlign = undefined;
        this.yAlign = undefined;
        this.x = undefined;
        this.y = undefined;
        this.height = undefined;
        this.width = undefined;
        this.caretX = undefined;
        this.caretY = undefined;
        this.labelColors = undefined;
        this.labelPointStyles = undefined;
        this.labelTextColors = undefined;
    }
    initialize(options) {
        this.options = options;
        this._cachedAnimations = undefined;
        this.$context = undefined;
    }
    _resolveAnimations() {
        const cached = this._cachedAnimations;
        if (cached) {
            return cached;
        }
        const chart = this.chart;
        const options = this.options.setContext(this.getContext());
        const opts = options.enabled && chart.options.animation && options.animations;
        const animations = new Animations(this.chart, opts);
        if (opts._cacheable) {
            this._cachedAnimations = Object.freeze(animations);
        }
        return animations;
    }
    getContext() {
        return this.$context || (this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
    }
    getTitle(context, options) {
        const { callbacks } = options;
        const beforeTitle = invokeCallbackWithFallback(callbacks, 'beforeTitle', this, context);
        const title = invokeCallbackWithFallback(callbacks, 'title', this, context);
        const afterTitle = invokeCallbackWithFallback(callbacks, 'afterTitle', this, context);
        let lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeTitle));
        lines = pushOrConcat(lines, splitNewlines(title));
        lines = pushOrConcat(lines, splitNewlines(afterTitle));
        return lines;
    }
    getBeforeBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'beforeBody', this, tooltipItems));
    }
    getBody(tooltipItems, options) {
        const { callbacks } = options;
        const bodyItems = [];
        each(tooltipItems, (context) => {
            const bodyItem = {
                before: [],
                lines: [],
                after: []
            };
            const scoped = overrideCallbacks(callbacks, context);
            pushOrConcat(bodyItem.before, splitNewlines(invokeCallbackWithFallback(scoped, 'beforeLabel', this, context)));
            pushOrConcat(bodyItem.lines, invokeCallbackWithFallback(scoped, 'label', this, context));
            pushOrConcat(bodyItem.after, splitNewlines(invokeCallbackWithFallback(scoped, 'afterLabel', this, context)));
            bodyItems.push(bodyItem);
        });
        return bodyItems;
    }
    getAfterBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(invokeCallbackWithFallback(options.callbacks, 'afterBody', this, tooltipItems));
    }
    getFooter(tooltipItems, options) {
        const { callbacks } = options;
        const beforeFooter = invokeCallbackWithFallback(callbacks, 'beforeFooter', this, tooltipItems);
        const footer = invokeCallbackWithFallback(callbacks, 'footer', this, tooltipItems);
        const afterFooter = invokeCallbackWithFallback(callbacks, 'afterFooter', this, tooltipItems);
        let lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeFooter));
        lines = pushOrConcat(lines, splitNewlines(footer));
        lines = pushOrConcat(lines, splitNewlines(afterFooter));
        return lines;
    }
    _createItems(options) {
        const active = this._active;
        const data = this.chart.data;
        const labelColors = [];
        const labelPointStyles = [];
        const labelTextColors = [];
        let tooltipItems = [];
        let i, len;
        for (i = 0, len = active.length; i < len; ++i) {
            tooltipItems.push(createTooltipItem(this.chart, active[i]));
        }
        if (options.filter) {
            tooltipItems = tooltipItems.filter((element, index, array) => options.filter(element, index, array, data));
        }
        if (options.itemSort) {
            tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
        }
        each(tooltipItems, (context) => {
            const scoped = overrideCallbacks(options.callbacks, context);
            labelColors.push(invokeCallbackWithFallback(scoped, 'labelColor', this, context));
            labelPointStyles.push(invokeCallbackWithFallback(scoped, 'labelPointStyle', this, context));
            labelTextColors.push(invokeCallbackWithFallback(scoped, 'labelTextColor', this, context));
        });
        this.labelColors = labelColors;
        this.labelPointStyles = labelPointStyles;
        this.labelTextColors = labelTextColors;
        this.dataPoints = tooltipItems;
        return tooltipItems;
    }
    update(changed, replay) {
        const options = this.options.setContext(this.getContext());
        const active = this._active;
        let properties;
        let tooltipItems = [];
        if (!active.length) {
            if (this.opacity !== 0) {
                properties = {
                    opacity: 0
                };
            }
        } else {
            const position = positioners[options.position].call(this, active, this._eventPosition);
            tooltipItems = this._createItems(options);
            this.title = this.getTitle(tooltipItems, options);
            this.beforeBody = this.getBeforeBody(tooltipItems, options);
            this.body = this.getBody(tooltipItems, options);
            this.afterBody = this.getAfterBody(tooltipItems, options);
            this.footer = this.getFooter(tooltipItems, options);
            const size = this._size = getTooltipSize(this, options);
            const positionAndSize = Object.assign({}, position, size);
            const alignment = determineAlignment(this.chart, options, positionAndSize);
            const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
            this.xAlign = alignment.xAlign;
            this.yAlign = alignment.yAlign;
            properties = {
                opacity: 1,
                x: backgroundPoint.x,
                y: backgroundPoint.y,
                width: size.width,
                height: size.height,
                caretX: position.x,
                caretY: position.y
            };
        }
        this._tooltipItems = tooltipItems;
        this.$context = undefined;
        if (properties) {
            this._resolveAnimations().update(this, properties);
        }
        if (changed && options.external) {
            options.external.call(this, {
                chart: this.chart,
                tooltip: this,
                replay
            });
        }
    }
    drawCaret(tooltipPoint, ctx, size, options) {
        const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
        ctx.lineTo(caretPosition.x1, caretPosition.y1);
        ctx.lineTo(caretPosition.x2, caretPosition.y2);
        ctx.lineTo(caretPosition.x3, caretPosition.y3);
    }
    getCaretPosition(tooltipPoint, size, options) {
        const { xAlign, yAlign } = this;
        const { caretSize, cornerRadius } = options;
        const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(cornerRadius);
        const { x: ptX, y: ptY } = tooltipPoint;
        const { width, height } = size;
        let x1, x2, x3, y1, y2, y3;
        if (yAlign === 'center') {
            y2 = ptY + height / 2;
            if (xAlign === 'left') {
                x1 = ptX;
                x2 = x1 - caretSize;
                y1 = y2 + caretSize;
                y3 = y2 - caretSize;
            } else {
                x1 = ptX + width;
                x2 = x1 + caretSize;
                y1 = y2 - caretSize;
                y3 = y2 + caretSize;
            }
            x3 = x1;
        } else {
            if (xAlign === 'left') {
                x2 = ptX + Math.max(topLeft, bottomLeft) + caretSize;
            } else if (xAlign === 'right') {
                x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
            } else {
                x2 = this.caretX;
            }
            if (yAlign === 'top') {
                y1 = ptY;
                y2 = y1 - caretSize;
                x1 = x2 - caretSize;
                x3 = x2 + caretSize;
            } else {
                y1 = ptY + height;
                y2 = y1 + caretSize;
                x1 = x2 + caretSize;
                x3 = x2 - caretSize;
            }
            y3 = y1;
        }
        return {
            x1,
            x2,
            x3,
            y1,
            y2,
            y3
        };
    }
    drawTitle(pt, ctx, options) {
        const title = this.title;
        const length = title.length;
        let titleFont, titleSpacing, i;
        if (length) {
            const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
            pt.x = getAlignedX(this, options.titleAlign, options);
            ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
            ctx.textBaseline = 'middle';
            titleFont = toFont(options.titleFont);
            titleSpacing = options.titleSpacing;
            ctx.fillStyle = options.titleColor;
            ctx.font = titleFont.string;
            for (i = 0; i < length; ++i) {
                ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
                pt.y += titleFont.lineHeight + titleSpacing;
                if (i + 1 === length) {
                    pt.y += options.titleMarginBottom - titleSpacing;
                }
            }
        }
    }
    _drawColorBox(ctx, pt, i, rtlHelper, options) {
        const labelColor = this.labelColors[i];
        const labelPointStyle = this.labelPointStyles[i];
        const { boxHeight, boxWidth } = options;
        const bodyFont = toFont(options.bodyFont);
        const colorX = getAlignedX(this, 'left', options);
        const rtlColorX = rtlHelper.x(colorX);
        const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
        const colorY = pt.y + yOffSet;
        if (options.usePointStyle) {
            const drawOptions = {
                radius: Math.min(boxWidth, boxHeight) / 2,
                pointStyle: labelPointStyle.pointStyle,
                rotation: labelPointStyle.rotation,
                borderWidth: 1
            };
            const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
            const centerY = colorY + boxHeight / 2;
            ctx.strokeStyle = options.multiKeyBackground;
            ctx.fillStyle = options.multiKeyBackground;
            drawPoint(ctx, drawOptions, centerX, centerY);
            ctx.strokeStyle = labelColor.borderColor;
            ctx.fillStyle = labelColor.backgroundColor;
            drawPoint(ctx, drawOptions, centerX, centerY);
        } else {
            ctx.lineWidth = isObject(labelColor.borderWidth) ? Math.max(...Object.values(labelColor.borderWidth)) : labelColor.borderWidth || 1;
            ctx.strokeStyle = labelColor.borderColor;
            ctx.setLineDash(labelColor.borderDash || []);
            ctx.lineDashOffset = labelColor.borderDashOffset || 0;
            const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth);
            const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - 2);
            const borderRadius = toTRBLCorners(labelColor.borderRadius);
            if (Object.values(borderRadius).some((v) => v !== 0)) {
                ctx.beginPath();
                ctx.fillStyle = options.multiKeyBackground;
                addRoundedRectPath(ctx, {
                    x: outerX,
                    y: colorY,
                    w: boxWidth,
                    h: boxHeight,
                    radius: borderRadius
                });
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = labelColor.backgroundColor;
                ctx.beginPath();
                addRoundedRectPath(ctx, {
                    x: innerX,
                    y: colorY + 1,
                    w: boxWidth - 2,
                    h: boxHeight - 2,
                    radius: borderRadius
                });
                ctx.fill();
            } else {
                ctx.fillStyle = options.multiKeyBackground;
                ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
                ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
                ctx.fillStyle = labelColor.backgroundColor;
                ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
            }
        }
        ctx.fillStyle = this.labelTextColors[i];
    }
    drawBody(pt, ctx, options) {
        const { body } = this;
        const { bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding } = options;
        const bodyFont = toFont(options.bodyFont);
        let bodyLineHeight = bodyFont.lineHeight;
        let xLinePadding = 0;
        const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
        const fillLineOfText = function (line) {
            ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
            pt.y += bodyLineHeight + bodySpacing;
        };
        const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
        let bodyItem, textColor, lines, i, j, ilen, jlen;
        ctx.textAlign = bodyAlign;
        ctx.textBaseline = 'middle';
        ctx.font = bodyFont.string;
        pt.x = getAlignedX(this, bodyAlignForCalculation, options);
        ctx.fillStyle = options.bodyColor;
        each(this.beforeBody, fillLineOfText);
        xLinePadding = displayColors && bodyAlignForCalculation !== 'right' ? bodyAlign === 'center' ? boxWidth / 2 + boxPadding : boxWidth + 2 + boxPadding : 0;
        for (i = 0, ilen = body.length; i < ilen; ++i) {
            bodyItem = body[i];
            textColor = this.labelTextColors[i];
            ctx.fillStyle = textColor;
            each(bodyItem.before, fillLineOfText);
            lines = bodyItem.lines;
            if (displayColors && lines.length) {
                this._drawColorBox(ctx, pt, i, rtlHelper, options);
                bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
            }
            for (j = 0, jlen = lines.length; j < jlen; ++j) {
                fillLineOfText(lines[j]);
                bodyLineHeight = bodyFont.lineHeight;
            }
            each(bodyItem.after, fillLineOfText);
        }
        xLinePadding = 0;
        bodyLineHeight = bodyFont.lineHeight;
        each(this.afterBody, fillLineOfText);
        pt.y -= bodySpacing;
    }
    drawFooter(pt, ctx, options) {
        const footer = this.footer;
        const length = footer.length;
        let footerFont, i;
        if (length) {
            const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
            pt.x = getAlignedX(this, options.footerAlign, options);
            pt.y += options.footerMarginTop;
            ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
            ctx.textBaseline = 'middle';
            footerFont = toFont(options.footerFont);
            ctx.fillStyle = options.footerColor;
            ctx.font = footerFont.string;
            for (i = 0; i < length; ++i) {
                ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
                pt.y += footerFont.lineHeight + options.footerSpacing;
            }
        }
    }
    drawBackground(pt, ctx, tooltipSize, options) {
        const { xAlign, yAlign } = this;
        const { x, y } = pt;
        const { width, height } = tooltipSize;
        const { topLeft, topRight, bottomLeft, bottomRight } = toTRBLCorners(options.cornerRadius);
        ctx.fillStyle = options.backgroundColor;
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.beginPath();
        ctx.moveTo(x + topLeft, y);
        if (yAlign === 'top') {
            this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x + width - topRight, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
        if (yAlign === 'center' && xAlign === 'right') {
            this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x + width, y + height - bottomRight);
        ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
        if (yAlign === 'bottom') {
            this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x + bottomLeft, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
        if (yAlign === 'center' && xAlign === 'left') {
            this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x, y + topLeft);
        ctx.quadraticCurveTo(x, y, x + topLeft, y);
        ctx.closePath();
        ctx.fill();
        if (options.borderWidth > 0) {
            ctx.stroke();
        }
    }
    _updateAnimationTarget(options) {
        const chart = this.chart;
        const anims = this.$animations;
        const animX = anims && anims.x;
        const animY = anims && anims.y;
        if (animX || animY) {
            const position = positioners[options.position].call(this, this._active, this._eventPosition);
            if (!position) {
                return;
            }
            const size = this._size = getTooltipSize(this, options);
            const positionAndSize = Object.assign({}, position, this._size);
            const alignment = determineAlignment(chart, options, positionAndSize);
            const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
            if (animX._to !== point.x || animY._to !== point.y) {
                this.xAlign = alignment.xAlign;
                this.yAlign = alignment.yAlign;
                this.width = size.width;
                this.height = size.height;
                this.caretX = position.x;
                this.caretY = position.y;
                this._resolveAnimations().update(this, point);
            }
        }
    }
    _willRender() {
        return !!this.opacity;
    }
    draw(ctx) {
        const options = this.options.setContext(this.getContext());
        let opacity = this.opacity;
        if (!opacity) {
            return;
        }
        this._updateAnimationTarget(options);
        const tooltipSize = {
            width: this.width,
            height: this.height
        };
        const pt = {
            x: this.x,
            y: this.y
        };
        opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
        const padding = toPadding(options.padding);
        const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
        if (options.enabled && hasTooltipContent) {
            ctx.save();
            ctx.globalAlpha = opacity;
            this.drawBackground(pt, ctx, tooltipSize, options);
            overrideTextDirection(ctx, options.textDirection);
            pt.y += padding.top;
            this.drawTitle(pt, ctx, options);
            this.drawBody(pt, ctx, options);
            this.drawFooter(pt, ctx, options);
            restoreTextDirection(ctx, options.textDirection);
            ctx.restore();
        }
    }
    getActiveElements() {
        return this._active || [];
    }
    setActiveElements(activeElements, eventPosition) {
        const lastActive = this._active;
        const active = activeElements.map(({ datasetIndex, index }) => {
            const meta = this.chart.getDatasetMeta(datasetIndex);
            if (!meta) {
                throw new Error('Cannot find a dataset at index ' + datasetIndex);
            }
            return {
                datasetIndex,
                element: meta.data[index],
                index
            };
        });
        const changed = !_elementsEqual(lastActive, active);
        const positionChanged = this._positionChanged(active, eventPosition);
        if (changed || positionChanged) {
            this._active = active;
            this._eventPosition = eventPosition;
            this._ignoreReplayEvents = true;
            this.update(true);
        }
    }
    handleEvent(e, replay, inChartArea = true) {
        if (replay && this._ignoreReplayEvents) {
            return false;
        }
        this._ignoreReplayEvents = false;
        const options = this.options;
        const lastActive = this._active || [];
        const active = this._getActiveElements(e, lastActive, replay, inChartArea);
        const positionChanged = this._positionChanged(active, e);
        const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
        if (changed) {
            this._active = active;
            if (options.enabled || options.external) {
                this._eventPosition = {
                    x: e.x,
                    y: e.y
                };
                this.update(true, replay);
            }
        }
        return changed;
    }
    _getActiveElements(e, lastActive, replay, inChartArea) {
        const options = this.options;
        if (e.type === 'mouseout') {
            return [];
        }
        if (!inChartArea) {
            return lastActive.filter((i) => this.chart.data.datasets[i.datasetIndex] && this.chart.getDatasetMeta(i.datasetIndex).controller.getParsed(i.index) !== undefined);
        }
        const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
        if (options.reverse) {
            active.reverse();
        }
        return active;
    }
    _positionChanged(active, e) {
        const { caretX, caretY, options } = this;
        const position = positioners[options.position].call(this, active, e);
        return position !== false && (caretX !== position.x || caretY !== position.y);
    }
}
var plugin_tooltip = {
    id: 'tooltip',
    _element: Tooltip,
    positioners,
    afterInit(chart, _args, options) {
        if (options) {
            chart.tooltip = new Tooltip({
                chart,
                options
            });
        }
    },
    beforeUpdate(chart, _args, options) {
        if (chart.tooltip) {
            chart.tooltip.initialize(options);
        }
    },
    reset(chart, _args, options) {
        if (chart.tooltip) {
            chart.tooltip.initialize(options);
        }
    },
    afterDraw(chart) {
        const tooltip = chart.tooltip;
        if (tooltip && tooltip._willRender()) {
            const args = {
                tooltip
            };
            if (chart.notifyPlugins('beforeTooltipDraw', {
                ...args,
                cancelable: true
            }) === false) {
                return;
            }
            tooltip.draw(chart.ctx);
            chart.notifyPlugins('afterTooltipDraw', args);
        }
    },
    afterEvent(chart, args) {
        if (chart.tooltip) {
            const useFinalPosition = args.replay;
            if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
                args.changed = true;
            }
        }
    },
    defaults: {
        enabled: true,
        external: null,
        position: 'average',
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        titleFont: {
            weight: 'bold'
        },
        titleSpacing: 2,
        titleMarginBottom: 6,
        titleAlign: 'left',
        bodyColor: '#fff',
        bodySpacing: 2,
        bodyFont: {},
        bodyAlign: 'left',
        footerColor: '#fff',
        footerSpacing: 2,
        footerMarginTop: 6,
        footerFont: {
            weight: 'bold'
        },
        footerAlign: 'left',
        padding: 6,
        caretPadding: 2,
        caretSize: 5,
        cornerRadius: 6,
        boxHeight: (ctx, opts) => opts.bodyFont.size,
        boxWidth: (ctx, opts) => opts.bodyFont.size,
        multiKeyBackground: '#fff',
        displayColors: true,
        boxPadding: 0,
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
        animation: {
            duration: 400,
            easing: 'easeOutQuart'
        },
        animations: {
            numbers: {
                type: 'number',
                properties: [
                    'x',
                    'y',
                    'width',
                    'height',
                    'caretX',
                    'caretY'
                ]
            },
            opacity: {
                easing: 'linear',
                duration: 200
            }
        },
        callbacks: defaultCallbacks
    },
    defaultRoutes: {
        bodyFont: 'font',
        footerFont: 'font',
        titleFont: 'font'
    },
    descriptors: {
        _scriptable: (name) => name !== 'filter' && name !== 'itemSort' && name !== 'external',
        _indexable: false,
        callbacks: {
            _scriptable: false,
            _indexable: false
        },
        animation: {
            _fallback: false
        },
        animations: {
            _fallback: 'animation'
        }
    },
    additionalOptionScopes: [
        'interaction'
    ]
};

var plugins = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Colors: plugin_colors,
    Decimation: plugin_decimation,
    Filler: index,
    Legend: plugin_legend,
    SubTitle: plugin_subtitle,
    Title: plugin_title,
    Tooltip: plugin_tooltip
});

const addIfString = (labels, raw, index, addedLabels) => {
    if (typeof raw === 'string') {
        index = labels.push(raw) - 1;
        addedLabels.unshift({
            index,
            label: raw
        });
    } else if (isNaN(raw)) {
        index = null;
    }
    return index;
};
function findOrAddLabel(labels, raw, index, addedLabels) {
    const first = labels.indexOf(raw);
    if (first === -1) {
        return addIfString(labels, raw, index, addedLabels);
    }
    const last = labels.lastIndexOf(raw);
    return first !== last ? index : first;
}
const validIndex = (index, max) => index === null ? null : _limitValue(Math.round(index), 0, max);
function _getLabelForValue(value) {
    const labels = this.getLabels();
    if (value >= 0 && value < labels.length) {
        return labels[value];
    }
    return value;
}
class CategoryScale extends Scale {
    static id = 'category';
    static defaults = {
        ticks: {
            callback: _getLabelForValue
        }
    };
    constructor(cfg) {
        super(cfg);
        this._startValue = undefined;
        this._valueRange = 0;
        this._addedLabels = [];
    }
    init(scaleOptions) {
        const added = this._addedLabels;
        if (added.length) {
            const labels = this.getLabels();
            for (const { index, label } of added) {
                if (labels[index] === label) {
                    labels.splice(index, 1);
                }
            }
            this._addedLabels = [];
        }
        super.init(scaleOptions);
    }
    parse(raw, index) {
        if (isNullOrUndef(raw)) {
            return null;
        }
        const labels = this.getLabels();
        index = isFinite(index) && labels[index] === raw ? index : findOrAddLabel(labels, raw, valueOrDefault(index, raw), this._addedLabels);
        return validIndex(index, labels.length - 1);
    }
    determineDataLimits() {
        const { minDefined, maxDefined } = this.getUserBounds();
        let { min, max } = this.getMinMax(true);
        if (this.options.bounds === 'ticks') {
            if (!minDefined) {
                min = 0;
            }
            if (!maxDefined) {
                max = this.getLabels().length - 1;
            }
        }
        this.min = min;
        this.max = max;
    }
    buildTicks() {
        const min = this.min;
        const max = this.max;
        const offset = this.options.offset;
        const ticks = [];
        let labels = this.getLabels();
        labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
        this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
        this._startValue = this.min - (offset ? 0.5 : 0);
        for (let value = min; value <= max; value++) {
            ticks.push({
                value
            });
        }
        return ticks;
    }
    getLabelForValue(value) {
        return _getLabelForValue.call(this, value);
    }
    configure() {
        super.configure();
        if (!this.isHorizontal()) {
            this._reversePixels = !this._reversePixels;
        }
    }
    getPixelForValue(value) {
        if (typeof value !== 'number') {
            value = this.parse(value);
        }
        return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
    }
    getPixelForTick(index) {
        const ticks = this.ticks;
        if (index < 0 || index > ticks.length - 1) {
            return null;
        }
        return this.getPixelForValue(ticks[index].value);
    }
    getValueForPixel(pixel) {
        return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
    }
    getBasePixel() {
        return this.bottom;
    }
}

function generateTicks$1(generationOptions, dataRange) {
    const ticks = [];
    const MIN_SPACING = 1e-14;
    const { bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds } = generationOptions;
    const unit = step || 1;
    const maxSpaces = maxTicks - 1;
    const { min: rmin, max: rmax } = dataRange;
    const minDefined = !isNullOrUndef(min);
    const maxDefined = !isNullOrUndef(max);
    const countDefined = !isNullOrUndef(count);
    const minSpacing = (rmax - rmin) / (maxDigits + 1);
    let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
    let factor, niceMin, niceMax, numSpaces;
    if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
        return [
            {
                value: rmin
            },
            {
                value: rmax
            }
        ];
    }
    numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
    if (numSpaces > maxSpaces) {
        spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
    }
    if (!isNullOrUndef(precision)) {
        factor = Math.pow(10, precision);
        spacing = Math.ceil(spacing * factor) / factor;
    }
    if (bounds === 'ticks') {
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMax = Math.ceil(rmax / spacing) * spacing;
    } else {
        niceMin = rmin;
        niceMax = rmax;
    }
    if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1000)) {
        numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
        spacing = (max - min) / numSpaces;
        niceMin = min;
        niceMax = max;
    } else if (countDefined) {
        niceMin = minDefined ? min : niceMin;
        niceMax = maxDefined ? max : niceMax;
        numSpaces = count - 1;
        spacing = (niceMax - niceMin) / numSpaces;
    } else {
        numSpaces = (niceMax - niceMin) / spacing;
        if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
            numSpaces = Math.round(numSpaces);
        } else {
            numSpaces = Math.ceil(numSpaces);
        }
    }
    const decimalPlaces = Math.max(_decimalPlaces(spacing), _decimalPlaces(niceMin));
    factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
    niceMin = Math.round(niceMin * factor) / factor;
    niceMax = Math.round(niceMax * factor) / factor;
    let j = 0;
    if (minDefined) {
        if (includeBounds && niceMin !== min) {
            ticks.push({
                value: min
            });
            if (niceMin < min) {
                j++;
            }
            if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
                j++;
            }
        } else if (niceMin < min) {
            j++;
        }
    }
    for (; j < numSpaces; ++j) {
        const tickValue = Math.round((niceMin + j * spacing) * factor) / factor;
        if (maxDefined && tickValue > max) {
            break;
        }
        ticks.push({
            value: tickValue
        });
    }
    if (maxDefined && includeBounds && niceMax !== max) {
        if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
            ticks[ticks.length - 1].value = max;
        } else {
            ticks.push({
                value: max
            });
        }
    } else if (!maxDefined || niceMax === max) {
        ticks.push({
            value: niceMax
        });
    }
    return ticks;
}
function relativeLabelSize(value, minSpacing, { horizontal, minRotation }) {
    const rad = toRadians(minRotation);
    const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001;
    const length = 0.75 * minSpacing * ('' + value).length;
    return Math.min(minSpacing / ratio, length);
}
class LinearScaleBase extends Scale {
    constructor(cfg) {
        super(cfg);
        this.start = undefined;
        this.end = undefined;
        this._startValue = undefined;
        this._endValue = undefined;
        this._valueRange = 0;
    }
    parse(raw, index) {
        if (isNullOrUndef(raw)) {
            return null;
        }
        if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
            return null;
        }
        return +raw;
    }
    handleTickRangeOptions() {
        const { beginAtZero } = this.options;
        const { minDefined, maxDefined } = this.getUserBounds();
        let { min, max } = this;
        const setMin = (v) => min = minDefined ? min : v;
        const setMax = (v) => max = maxDefined ? max : v;
        if (beginAtZero) {
            const minSign = sign(min);
            const maxSign = sign(max);
            if (minSign < 0 && maxSign < 0) {
                setMax(0);
            } else if (minSign > 0 && maxSign > 0) {
                setMin(0);
            }
        }
        if (min === max) {
            let offset = max === 0 ? 1 : Math.abs(max * 0.05);
            setMax(max + offset);
            if (!beginAtZero) {
                setMin(min - offset);
            }
        }
        this.min = min;
        this.max = max;
    }
    getTickLimit() {
        const tickOpts = this.options.ticks;
        let { maxTicksLimit, stepSize } = tickOpts;
        let maxTicks;
        if (stepSize) {
            maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
            if (maxTicks > 1000) {
                console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
                maxTicks = 1000;
            }
        } else {
            maxTicks = this.computeTickLimit();
            maxTicksLimit = maxTicksLimit || 11;
        }
        if (maxTicksLimit) {
            maxTicks = Math.min(maxTicksLimit, maxTicks);
        }
        return maxTicks;
    }
    computeTickLimit() {
        return Number.POSITIVE_INFINITY;
    }
    buildTicks() {
        const opts = this.options;
        const tickOpts = opts.ticks;
        let maxTicks = this.getTickLimit();
        maxTicks = Math.max(2, maxTicks);
        const numericGeneratorOptions = {
            maxTicks,
            bounds: opts.bounds,
            min: opts.min,
            max: opts.max,
            precision: tickOpts.precision,
            step: tickOpts.stepSize,
            count: tickOpts.count,
            maxDigits: this._maxDigits(),
            horizontal: this.isHorizontal(),
            minRotation: tickOpts.minRotation || 0,
            includeBounds: tickOpts.includeBounds !== false
        };
        const dataRange = this._range || this;
        const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
        if (opts.bounds === 'ticks') {
            _setMinAndMaxByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
            ticks.reverse();
            this.start = this.max;
            this.end = this.min;
        } else {
            this.start = this.min;
            this.end = this.max;
        }
        return ticks;
    }
    configure() {
        const ticks = this.ticks;
        let start = this.min;
        let end = this.max;
        super.configure();
        if (this.options.offset && ticks.length) {
            const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
            start -= offset;
            end += offset;
        }
        this._startValue = start;
        this._endValue = end;
        this._valueRange = end - start;
    }
    getLabelForValue(value) {
        return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
    }
}

class LinearScale extends LinearScaleBase {
    static id = 'linear';
    static defaults = {
        ticks: {
            callback: Ticks.formatters.numeric
        }
    };
    determineDataLimits() {
        const { min, max } = this.getMinMax(true);
        this.min = isNumberFinite(min) ? min : 0;
        this.max = isNumberFinite(max) ? max : 1;
        this.handleTickRangeOptions();
    }
    computeTickLimit() {
        const horizontal = this.isHorizontal();
        const length = horizontal ? this.width : this.height;
        const minRotation = toRadians(this.options.ticks.minRotation);
        const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001;
        const tickFont = this._resolveTickFontOptions(0);
        return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
    }
    getPixelForValue(value) {
        return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
    }
    getValueForPixel(pixel) {
        return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
    }
}

const log10Floor = (v) => Math.floor(log10(v));
const changeExponent = (v, m) => Math.pow(10, log10Floor(v) + m);
function isMajor(tickVal) {
    const remain = tickVal / Math.pow(10, log10Floor(tickVal));
    return remain === 1;
}
function steps(min, max, rangeExp) {
    const rangeStep = Math.pow(10, rangeExp);
    const start = Math.floor(min / rangeStep);
    const end = Math.ceil(max / rangeStep);
    return end - start;
}
function startExp(min, max) {
    const range = max - min;
    let rangeExp = log10Floor(range);
    while (steps(min, max, rangeExp) > 10) {
        rangeExp++;
    }
    while (steps(min, max, rangeExp) < 10) {
        rangeExp--;
    }
    return Math.min(rangeExp, log10Floor(min));
}
function generateTicks(generationOptions, { min, max }) {
    min = finiteOrDefault(generationOptions.min, min);
    const ticks = [];
    const minExp = log10Floor(min);
    let exp = startExp(min, max);
    let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
    const stepSize = Math.pow(10, exp);
    const base = minExp > exp ? Math.pow(10, minExp) : 0;
    const start = Math.round((min - base) * precision) / precision;
    const offset = Math.floor((min - base) / stepSize / 10) * stepSize * 10;
    let significand = Math.floor((start - offset) / Math.pow(10, exp));
    let value = finiteOrDefault(generationOptions.min, Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision);
    while (value < max) {
        ticks.push({
            value,
            major: isMajor(value),
            significand
        });
        if (significand >= 10) {
            significand = significand < 15 ? 15 : 20;
        } else {
            significand++;
        }
        if (significand >= 20) {
            exp++;
            significand = 2;
            precision = exp >= 0 ? 1 : precision;
        }
        value = Math.round((base + offset + significand * Math.pow(10, exp)) * precision) / precision;
    }
    const lastTick = finiteOrDefault(generationOptions.max, value);
    ticks.push({
        value: lastTick,
        major: isMajor(lastTick),
        significand
    });
    return ticks;
}
class LogarithmicScale extends Scale {
    static id = 'logarithmic';
    static defaults = {
        ticks: {
            callback: Ticks.formatters.logarithmic,
            major: {
                enabled: true
            }
        }
    };
    constructor(cfg) {
        super(cfg);
        this.start = undefined;
        this.end = undefined;
        this._startValue = undefined;
        this._valueRange = 0;
    }
    parse(raw, index) {
        const value = LinearScaleBase.prototype.parse.apply(this, [
            raw,
            index
        ]);
        if (value === 0) {
            this._zero = true;
            return undefined;
        }
        return isNumberFinite(value) && value > 0 ? value : null;
    }
    determineDataLimits() {
        const { min, max } = this.getMinMax(true);
        this.min = isNumberFinite(min) ? Math.max(0, min) : null;
        this.max = isNumberFinite(max) ? Math.max(0, max) : null;
        if (this.options.beginAtZero) {
            this._zero = true;
        }
        if (this._zero && this.min !== this._suggestedMin && !isNumberFinite(this._userMin)) {
            this.min = min === changeExponent(this.min, 0) ? changeExponent(this.min, -1) : changeExponent(this.min, 0);
        }
        this.handleTickRangeOptions();
    }
    handleTickRangeOptions() {
        const { minDefined, maxDefined } = this.getUserBounds();
        let min = this.min;
        let max = this.max;
        const setMin = (v) => min = minDefined ? min : v;
        const setMax = (v) => max = maxDefined ? max : v;
        if (min === max) {
            if (min <= 0) {
                setMin(1);
                setMax(10);
            } else {
                setMin(changeExponent(min, -1));
                setMax(changeExponent(max, +1));
            }
        }
        if (min <= 0) {
            setMin(changeExponent(max, -1));
        }
        if (max <= 0) {
            setMax(changeExponent(min, +1));
        }
        this.min = min;
        this.max = max;
    }
    buildTicks() {
        const opts = this.options;
        const generationOptions = {
            min: this._userMin,
            max: this._userMax
        };
        const ticks = generateTicks(generationOptions, this);
        if (opts.bounds === 'ticks') {
            _setMinAndMaxByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
            ticks.reverse();
            this.start = this.max;
            this.end = this.min;
        } else {
            this.start = this.min;
            this.end = this.max;
        }
        return ticks;
    }
    getLabelForValue(value) {
        return value === undefined ? '0' : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
    }
    configure() {
        const start = this.min;
        super.configure();
        this._startValue = log10(start);
        this._valueRange = log10(this.max) - log10(start);
    }
    getPixelForValue(value) {
        if (value === undefined || value === 0) {
            value = this.min;
        }
        if (value === null || isNaN(value)) {
            return NaN;
        }
        return this.getPixelForDecimal(value === this.min ? 0 : (log10(value) - this._startValue) / this._valueRange);
    }
    getValueForPixel(pixel) {
        const decimal = this.getDecimalForPixel(pixel);
        return Math.pow(10, this._startValue + decimal * this._valueRange);
    }
}

function getTickBackdropHeight(opts) {
    const tickOpts = opts.ticks;
    if (tickOpts.display && opts.display) {
        const padding = toPadding(tickOpts.backdropPadding);
        return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
    }
    return 0;
}
function measureLabelSize(ctx, font, label) {
    label = isArray(label) ? label : [
        label
    ];
    return {
        w: _longestText(ctx, font.string, label),
        h: label.length * font.lineHeight
    };
}
function determineLimits(angle, pos, size, min, max) {
    if (angle === min || angle === max) {
        return {
            start: pos - size / 2,
            end: pos + size / 2
        };
    } else if (angle < min || angle > max) {
        return {
            start: pos - size,
            end: pos
        };
    }
    return {
        start: pos,
        end: pos + size
    };
}
function fitWithPointLabels(scale) {
    const orig = {
        l: scale.left + scale._padding.left,
        r: scale.right - scale._padding.right,
        t: scale.top + scale._padding.top,
        b: scale.bottom - scale._padding.bottom
    };
    const limits = Object.assign({}, orig);
    const labelSizes = [];
    const padding = [];
    const valueCount = scale._pointLabels.length;
    const pointLabelOpts = scale.options.pointLabels;
    const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
    for (let i = 0; i < valueCount; i++) {
        const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
        padding[i] = opts.padding;
        const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
        const plFont = toFont(opts.font);
        const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
        labelSizes[i] = textSize;
        const angleRadians = _normalizeAngle(scale.getIndexAngle(i) + additionalAngle);
        const angle = Math.round(toDegrees(angleRadians));
        const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
        const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
        updateLimits(limits, orig, angleRadians, hLimits, vLimits);
    }
    scale.setCenterPoint(orig.l - limits.l, limits.r - orig.r, orig.t - limits.t, limits.b - orig.b);
    scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
}
function updateLimits(limits, orig, angle, hLimits, vLimits) {
    const sin = Math.abs(Math.sin(angle));
    const cos = Math.abs(Math.cos(angle));
    let x = 0;
    let y = 0;
    if (hLimits.start < orig.l) {
        x = (orig.l - hLimits.start) / sin;
        limits.l = Math.min(limits.l, orig.l - x);
    } else if (hLimits.end > orig.r) {
        x = (hLimits.end - orig.r) / sin;
        limits.r = Math.max(limits.r, orig.r + x);
    }
    if (vLimits.start < orig.t) {
        y = (orig.t - vLimits.start) / cos;
        limits.t = Math.min(limits.t, orig.t - y);
    } else if (vLimits.end > orig.b) {
        y = (vLimits.end - orig.b) / cos;
        limits.b = Math.max(limits.b, orig.b + y);
    }
}
function createPointLabelItem(scale, index, itemOpts) {
    const outerDistance = scale.drawingArea;
    const { extra, additionalAngle, padding, size } = itemOpts;
    const pointLabelPosition = scale.getPointPosition(index, outerDistance + extra + padding, additionalAngle);
    const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
    const y = yForAngle(pointLabelPosition.y, size.h, angle);
    const textAlign = getTextAlignForAngle(angle);
    const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
    return {
        visible: true,
        x: pointLabelPosition.x,
        y,
        textAlign,
        left,
        top: y,
        right: left + size.w,
        bottom: y + size.h
    };
}
function isNotOverlapped(item, area) {
    if (!area) {
        return true;
    }
    const { left, top, right, bottom } = item;
    const apexesInArea = _isPointInArea({
        x: left,
        y: top
    }, area) || _isPointInArea({
        x: left,
        y: bottom
    }, area) || _isPointInArea({
        x: right,
        y: top
    }, area) || _isPointInArea({
        x: right,
        y: bottom
    }, area);
    return !apexesInArea;
}
function buildPointLabelItems(scale, labelSizes, padding) {
    const items = [];
    const valueCount = scale._pointLabels.length;
    const opts = scale.options;
    const { centerPointLabels, display } = opts.pointLabels;
    const itemOpts = {
        extra: getTickBackdropHeight(opts) / 2,
        additionalAngle: centerPointLabels ? PI / valueCount : 0
    };
    let area;
    for (let i = 0; i < valueCount; i++) {
        itemOpts.padding = padding[i];
        itemOpts.size = labelSizes[i];
        const item = createPointLabelItem(scale, i, itemOpts);
        items.push(item);
        if (display === 'auto') {
            item.visible = isNotOverlapped(item, area);
            if (item.visible) {
                area = item;
            }
        }
    }
    return items;
}
function getTextAlignForAngle(angle) {
    if (angle === 0 || angle === 180) {
        return 'center';
    } else if (angle < 180) {
        return 'left';
    }
    return 'right';
}
function leftForTextAlign(x, w, align) {
    if (align === 'right') {
        x -= w;
    } else if (align === 'center') {
        x -= w / 2;
    }
    return x;
}
function yForAngle(y, h, angle) {
    if (angle === 90 || angle === 270) {
        y -= h / 2;
    } else if (angle > 270 || angle < 90) {
        y -= h;
    }
    return y;
}
function drawPointLabelBox(ctx, opts, item) {
    const { left, top, right, bottom } = item;
    const { backdropColor } = opts;
    if (!isNullOrUndef(backdropColor)) {
        const borderRadius = toTRBLCorners(opts.borderRadius);
        const padding = toPadding(opts.backdropPadding);
        ctx.fillStyle = backdropColor;
        const backdropLeft = left - padding.left;
        const backdropTop = top - padding.top;
        const backdropWidth = right - left + padding.width;
        const backdropHeight = bottom - top + padding.height;
        if (Object.values(borderRadius).some((v) => v !== 0)) {
            ctx.beginPath();
            addRoundedRectPath(ctx, {
                x: backdropLeft,
                y: backdropTop,
                w: backdropWidth,
                h: backdropHeight,
                radius: borderRadius
            });
            ctx.fill();
        } else {
            ctx.fillRect(backdropLeft, backdropTop, backdropWidth, backdropHeight);
        }
    }
}
function drawPointLabels(scale, labelCount) {
    const { ctx, options: { pointLabels } } = scale;
    for (let i = labelCount - 1; i >= 0; i--) {
        const item = scale._pointLabelItems[i];
        if (!item.visible) {
            continue;
        }
        const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
        drawPointLabelBox(ctx, optsAtIndex, item);
        const plFont = toFont(optsAtIndex.font);
        const { x, y, textAlign } = item;
        renderText(ctx, scale._pointLabels[i], x, y + plFont.lineHeight / 2, plFont, {
            color: optsAtIndex.color,
            textAlign: textAlign,
            textBaseline: 'middle'
        });
    }
}
function pathRadiusLine(scale, radius, circular, labelCount) {
    const { ctx } = scale;
    if (circular) {
        ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
    } else {
        let pointPosition = scale.getPointPosition(0, radius);
        ctx.moveTo(pointPosition.x, pointPosition.y);
        for (let i = 1; i < labelCount; i++) {
            pointPosition = scale.getPointPosition(i, radius);
            ctx.lineTo(pointPosition.x, pointPosition.y);
        }
    }
}
function drawRadiusLine(scale, gridLineOpts, radius, labelCount, borderOpts) {
    const ctx = scale.ctx;
    const circular = gridLineOpts.circular;
    const { color, lineWidth } = gridLineOpts;
    if (!circular && !labelCount || !color || !lineWidth || radius < 0) {
        return;
    }
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(borderOpts.dash || []);
    ctx.lineDashOffset = borderOpts.dashOffset;
    ctx.beginPath();
    pathRadiusLine(scale, radius, circular, labelCount);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}
function createPointLabelContext(parent, index, label) {
    return createContext(parent, {
        label,
        index,
        type: 'pointLabel'
    });
}
class RadialLinearScale extends LinearScaleBase {
    static id = 'radialLinear';
    static defaults = {
        display: true,
        animate: true,
        position: 'chartArea',
        angleLines: {
            display: true,
            lineWidth: 1,
            borderDash: [],
            borderDashOffset: 0.0
        },
        grid: {
            circular: false
        },
        startAngle: 0,
        ticks: {
            showLabelBackdrop: true,
            callback: Ticks.formatters.numeric
        },
        pointLabels: {
            backdropColor: undefined,
            backdropPadding: 2,
            display: true,
            font: {
                size: 10
            },
            callback(label) {
                return label;
            },
            padding: 5,
            centerPointLabels: false
        }
    };
    static defaultRoutes = {
        'angleLines.color': 'borderColor',
        'pointLabels.color': 'color',
        'ticks.color': 'color'
    };
    static descriptors = {
        angleLines: {
            _fallback: 'grid'
        }
    };
    constructor(cfg) {
        super(cfg);
        this.xCenter = undefined;
        this.yCenter = undefined;
        this.drawingArea = undefined;
        this._pointLabels = [];
        this._pointLabelItems = [];
    }
    setDimensions() {
        const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
        const w = this.width = this.maxWidth - padding.width;
        const h = this.height = this.maxHeight - padding.height;
        this.xCenter = Math.floor(this.left + w / 2 + padding.left);
        this.yCenter = Math.floor(this.top + h / 2 + padding.top);
        this.drawingArea = Math.floor(Math.min(w, h) / 2);
    }
    determineDataLimits() {
        const { min, max } = this.getMinMax(false);
        this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
        this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
        this.handleTickRangeOptions();
    }
    computeTickLimit() {
        return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
    }
    generateTickLabels(ticks) {
        LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
        this._pointLabels = this.getLabels().map((value, index) => {
            const label = callback(this.options.pointLabels.callback, [
                value,
                index
            ], this);
            return label || label === 0 ? label : '';
        }).filter((v, i) => this.chart.getDataVisibility(i));
    }
    fit() {
        const opts = this.options;
        if (opts.display && opts.pointLabels.display) {
            fitWithPointLabels(this);
        } else {
            this.setCenterPoint(0, 0, 0, 0);
        }
    }
    setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
        this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
        this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
        this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
    }
    getIndexAngle(index) {
        const angleMultiplier = TAU / (this._pointLabels.length || 1);
        const startAngle = this.options.startAngle || 0;
        return _normalizeAngle(index * angleMultiplier + toRadians(startAngle));
    }
    getDistanceFromCenterForValue(value) {
        if (isNullOrUndef(value)) {
            return NaN;
        }
        const scalingFactor = this.drawingArea / (this.max - this.min);
        if (this.options.reverse) {
            return (this.max - value) * scalingFactor;
        }
        return (value - this.min) * scalingFactor;
    }
    getValueForDistanceFromCenter(distance) {
        if (isNullOrUndef(distance)) {
            return NaN;
        }
        const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
        return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
    }
    getPointLabelContext(index) {
        const pointLabels = this._pointLabels || [];
        if (index >= 0 && index < pointLabels.length) {
            const pointLabel = pointLabels[index];
            return createPointLabelContext(this.getContext(), index, pointLabel);
        }
    }
    getPointPosition(index, distanceFromCenter, additionalAngle = 0) {
        const angle = this.getIndexAngle(index) - HALF_PI + additionalAngle;
        return {
            x: Math.cos(angle) * distanceFromCenter + this.xCenter,
            y: Math.sin(angle) * distanceFromCenter + this.yCenter,
            angle
        };
    }
    getPointPositionForValue(index, value) {
        return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
    }
    getBasePosition(index) {
        return this.getPointPositionForValue(index || 0, this.getBaseValue());
    }
    getPointLabelPosition(index) {
        const { left, top, right, bottom } = this._pointLabelItems[index];
        return {
            left,
            top,
            right,
            bottom
        };
    }
    drawBackground() {
        const { backgroundColor, grid: { circular } } = this.options;
        if (backgroundColor) {
            const ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
            ctx.closePath();
            ctx.fillStyle = backgroundColor;
            ctx.fill();
            ctx.restore();
        }
    }
    drawGrid() {
        const ctx = this.ctx;
        const opts = this.options;
        const { angleLines, grid, border } = opts;
        const labelCount = this._pointLabels.length;
        let i, offset, position;
        if (opts.pointLabels.display) {
            drawPointLabels(this, labelCount);
        }
        if (grid.display) {
            this.ticks.forEach((tick, index) => {
                if (index !== 0 || index === 0 && this.min < 0) {
                    offset = this.getDistanceFromCenterForValue(tick.value);
                    const context = this.getContext(index);
                    const optsAtIndex = grid.setContext(context);
                    const optsAtIndexBorder = border.setContext(context);
                    drawRadiusLine(this, optsAtIndex, offset, labelCount, optsAtIndexBorder);
                }
            });
        }
        if (angleLines.display) {
            ctx.save();
            for (i = labelCount - 1; i >= 0; i--) {
                const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
                const { color, lineWidth } = optsAtIndex;
                if (!lineWidth || !color) {
                    continue;
                }
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.setLineDash(optsAtIndex.borderDash);
                ctx.lineDashOffset = optsAtIndex.borderDashOffset;
                offset = this.getDistanceFromCenterForValue(opts.reverse ? this.min : this.max);
                position = this.getPointPosition(i, offset);
                ctx.beginPath();
                ctx.moveTo(this.xCenter, this.yCenter);
                ctx.lineTo(position.x, position.y);
                ctx.stroke();
            }
            ctx.restore();
        }
    }
    drawBorder() { }
    drawLabels() {
        const ctx = this.ctx;
        const opts = this.options;
        const tickOpts = opts.ticks;
        if (!tickOpts.display) {
            return;
        }
        const startAngle = this.getIndexAngle(0);
        let offset, width;
        ctx.save();
        ctx.translate(this.xCenter, this.yCenter);
        ctx.rotate(startAngle);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.ticks.forEach((tick, index) => {
            if (index === 0 && this.min >= 0 && !opts.reverse) {
                return;
            }
            const optsAtIndex = tickOpts.setContext(this.getContext(index));
            const tickFont = toFont(optsAtIndex.font);
            offset = this.getDistanceFromCenterForValue(this.ticks[index].value);
            if (optsAtIndex.showLabelBackdrop) {
                ctx.font = tickFont.string;
                width = ctx.measureText(tick.label).width;
                ctx.fillStyle = optsAtIndex.backdropColor;
                const padding = toPadding(optsAtIndex.backdropPadding);
                ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
            }
            renderText(ctx, tick.label, 0, -offset, tickFont, {
                color: optsAtIndex.color,
                strokeColor: optsAtIndex.textStrokeColor,
                strokeWidth: optsAtIndex.textStrokeWidth
            });
        });
        ctx.restore();
    }
    drawTitle() { }
}

const INTERVALS = {
    millisecond: {
        common: true,
        size: 1,
        steps: 1000
    },
    second: {
        common: true,
        size: 1000,
        steps: 60
    },
    minute: {
        common: true,
        size: 60000,
        steps: 60
    },
    hour: {
        common: true,
        size: 3600000,
        steps: 24
    },
    day: {
        common: true,
        size: 86400000,
        steps: 30
    },
    week: {
        common: false,
        size: 604800000,
        steps: 4
    },
    month: {
        common: true,
        size: 2.628e9,
        steps: 12
    },
    quarter: {
        common: false,
        size: 7.884e9,
        steps: 4
    },
    year: {
        common: true,
        size: 3.154e10
    }
};
const UNITS =  /* #__PURE__ */ Object.keys(INTERVALS);
function sorter(a, b) {
    return a - b;
}
function parse(scale, input) {
    if (isNullOrUndef(input)) {
        return null;
    }
    const adapter = scale._adapter;
    const { parser, round, isoWeekday } = scale._parseOpts;
    let value = input;
    if (typeof parser === 'function') {
        value = parser(value);
    }
    if (!isNumberFinite(value)) {
        value = typeof parser === 'string' ? adapter.parse(value, parser) : adapter.parse(value);
    }
    if (value === null) {
        return null;
    }
    if (round) {
        value = round === 'week' && (isNumber(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, 'isoWeek', isoWeekday) : adapter.startOf(value, round);
    }
    return +value;
}
function determineUnitForAutoTicks(minUnit, min, max, capacity) {
    const ilen = UNITS.length;
    for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
        const interval = INTERVALS[UNITS[i]];
        const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
        if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
            return UNITS[i];
        }
    }
    return UNITS[ilen - 1];
}
function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
    for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
        const unit = UNITS[i];
        if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
            return unit;
        }
    }
    return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}
function determineMajorUnit(unit) {
    for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
        if (INTERVALS[UNITS[i]].common) {
            return UNITS[i];
        }
    }
}
function addTick(ticks, time, timestamps) {
    if (!timestamps) {
        ticks[time] = true;
    } else if (timestamps.length) {
        const { lo, hi } = _lookup(timestamps, time);
        const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
        ticks[timestamp] = true;
    }
}
function setMajorTicks(scale, ticks, map, majorUnit) {
    const adapter = scale._adapter;
    const first = +adapter.startOf(ticks[0].value, majorUnit);
    const last = ticks[ticks.length - 1].value;
    let major, index;
    for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
        index = map[major];
        if (index >= 0) {
            ticks[index].major = true;
        }
    }
    return ticks;
}
function ticksFromTimestamps(scale, values, majorUnit) {
    const ticks = [];
    const map = {};
    const ilen = values.length;
    let i, value;
    for (i = 0; i < ilen; ++i) {
        value = values[i];
        map[value] = i;
        ticks.push({
            value,
            major: false
        });
    }
    return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
}
class TimeScale extends Scale {
    static id = 'time';
    static defaults = {
        bounds: 'data',
        adapters: {},
        time: {
            parser: false,
            unit: false,
            round: false,
            isoWeekday: false,
            minUnit: 'millisecond',
            displayFormats: {}
        },
        ticks: {
            source: 'auto',
            callback: false,
            major: {
                enabled: false
            }
        }
    };
    constructor(props) {
        super(props);
        this._cache = {
            data: [],
            labels: [],
            all: []
        };
        this._unit = 'day';
        this._majorUnit = undefined;
        this._offsets = {};
        this._normalized = false;
        this._parseOpts = undefined;
    }
    init(scaleOpts, opts = {}) {
        const time = scaleOpts.time || (scaleOpts.time = {});
        const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
        adapter.init(opts);
        mergeIf(time.displayFormats, adapter.formats());
        this._parseOpts = {
            parser: time.parser,
            round: time.round,
            isoWeekday: time.isoWeekday
        };
        super.init(scaleOpts);
        this._normalized = opts.normalized;
    }
    parse(raw, index) {
        if (raw === undefined) {
            return null;
        }
        return parse(this, raw);
    }
    beforeLayout() {
        super.beforeLayout();
        this._cache = {
            data: [],
            labels: [],
            all: []
        };
    }
    determineDataLimits() {
        const options = this.options;
        const adapter = this._adapter;
        const unit = options.time.unit || 'day';
        let { min, max, minDefined, maxDefined } = this.getUserBounds();
        function _applyBounds(bounds) {
            if (!minDefined && !isNaN(bounds.min)) {
                min = Math.min(min, bounds.min);
            }
            if (!maxDefined && !isNaN(bounds.max)) {
                max = Math.max(max, bounds.max);
            }
        }
        if (!minDefined || !maxDefined) {
            _applyBounds(this._getLabelBounds());
            if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
                _applyBounds(this.getMinMax(false));
            }
        }
        min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
        max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
        this.min = Math.min(min, max - 1);
        this.max = Math.max(min + 1, max);
    }
    _getLabelBounds() {
        const arr = this.getLabelTimestamps();
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        if (arr.length) {
            min = arr[0];
            max = arr[arr.length - 1];
        }
        return {
            min,
            max
        };
    }
    buildTicks() {
        const options = this.options;
        const timeOpts = options.time;
        const tickOpts = options.ticks;
        const timestamps = tickOpts.source === 'labels' ? this.getLabelTimestamps() : this._generate();
        if (options.bounds === 'ticks' && timestamps.length) {
            this.min = this._userMin || timestamps[0];
            this.max = this._userMax || timestamps[timestamps.length - 1];
        }
        const min = this.min;
        const max = this.max;
        const ticks = _filterBetween(timestamps, min, max);
        this._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min)) : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
        this._majorUnit = !tickOpts.major.enabled || this._unit === 'year' ? undefined : determineMajorUnit(this._unit);
        this.initOffsets(timestamps);
        if (options.reverse) {
            ticks.reverse();
        }
        return ticksFromTimestamps(this, ticks, this._majorUnit);
    }
    afterAutoSkip() {
        if (this.options.offsetAfterAutoskip) {
            this.initOffsets(this.ticks.map((tick) => +tick.value));
        }
    }
    initOffsets(timestamps = []) {
        let start = 0;
        let end = 0;
        let first, last;
        if (this.options.offset && timestamps.length) {
            first = this.getDecimalForValue(timestamps[0]);
            if (timestamps.length === 1) {
                start = 1 - first;
            } else {
                start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
            }
            last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
            if (timestamps.length === 1) {
                end = last;
            } else {
                end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
            }
        }
        const limit = timestamps.length < 3 ? 0.5 : 0.25;
        start = _limitValue(start, 0, limit);
        end = _limitValue(end, 0, limit);
        this._offsets = {
            start,
            end,
            factor: 1 / (start + 1 + end)
        };
    }
    _generate() {
        const adapter = this._adapter;
        const min = this.min;
        const max = this.max;
        const options = this.options;
        const timeOpts = options.time;
        const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
        const stepSize = valueOrDefault(options.ticks.stepSize, 1);
        const weekday = minor === 'week' ? timeOpts.isoWeekday : false;
        const hasWeekday = isNumber(weekday) || weekday === true;
        const ticks = {};
        let first = min;
        let time, count;
        if (hasWeekday) {
            first = +adapter.startOf(first, 'isoWeek', weekday);
        }
        first = +adapter.startOf(first, hasWeekday ? 'day' : minor);
        if (adapter.diff(max, min, minor) > 100000 * stepSize) {
            throw new Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
        }
        const timestamps = options.ticks.source === 'data' && this.getDataTimestamps();
        for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
            addTick(ticks, time, timestamps);
        }
        if (time === max || options.bounds === 'ticks' || count === 1) {
            addTick(ticks, time, timestamps);
        }
        return Object.keys(ticks).sort(sorter).map((x) => +x);
    }
    getLabelForValue(value) {
        const adapter = this._adapter;
        const timeOpts = this.options.time;
        if (timeOpts.tooltipFormat) {
            return adapter.format(value, timeOpts.tooltipFormat);
        }
        return adapter.format(value, timeOpts.displayFormats.datetime);
    }
    format(value, format) {
        const options = this.options;
        const formats = options.time.displayFormats;
        const unit = this._unit;
        const fmt = format || formats[unit];
        return this._adapter.format(value, fmt);
    }
    _tickFormatFunction(time, index, ticks, format) {
        const options = this.options;
        const formatter = options.ticks.callback;
        if (formatter) {
            return callback(formatter, [
                time,
                index,
                ticks
            ], this);
        }
        const formats = options.time.displayFormats;
        const unit = this._unit;
        const majorUnit = this._majorUnit;
        const minorFormat = unit && formats[unit];
        const majorFormat = majorUnit && formats[majorUnit];
        const tick = ticks[index];
        const major = majorUnit && majorFormat && tick && tick.major;
        return this._adapter.format(time, format || (major ? majorFormat : minorFormat));
    }
    generateTickLabels(ticks) {
        let i, ilen, tick;
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
            tick = ticks[i];
            tick.label = this._tickFormatFunction(tick.value, i, ticks);
        }
    }
    getDecimalForValue(value) {
        return value === null ? NaN : (value - this.min) / (this.max - this.min);
    }
    getPixelForValue(value) {
        const offsets = this._offsets;
        const pos = this.getDecimalForValue(value);
        return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
    }
    getValueForPixel(pixel) {
        const offsets = this._offsets;
        const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return this.min + pos * (this.max - this.min);
    }
    _getLabelSize(label) {
        const ticksOpts = this.options.ticks;
        const tickLabelWidth = this.ctx.measureText(label).width;
        const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
        const cosRotation = Math.cos(angle);
        const sinRotation = Math.sin(angle);
        const tickFontSize = this._resolveTickFontOptions(0).size;
        return {
            w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
            h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
        };
    }
    _getLabelCapacity(exampleTime) {
        const timeOpts = this.options.time;
        const displayFormats = timeOpts.displayFormats;
        const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
        const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [
            exampleTime
        ], this._majorUnit), format);
        const size = this._getLabelSize(exampleLabel);
        const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
        return capacity > 0 ? capacity : 1;
    }
    getDataTimestamps() {
        let timestamps = this._cache.data || [];
        let i, ilen;
        if (timestamps.length) {
            return timestamps;
        }
        const metas = this.getMatchingVisibleMetas();
        if (this._normalized && metas.length) {
            return this._cache.data = metas[0].controller.getAllParsedValues(this);
        }
        for (i = 0, ilen = metas.length; i < ilen; ++i) {
            timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
        }
        return this._cache.data = this.normalize(timestamps);
    }
    getLabelTimestamps() {
        const timestamps = this._cache.labels || [];
        let i, ilen;
        if (timestamps.length) {
            return timestamps;
        }
        const labels = this.getLabels();
        for (i = 0, ilen = labels.length; i < ilen; ++i) {
            timestamps.push(parse(this, labels[i]));
        }
        return this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps);
    }
    normalize(values) {
        return _arrayUnique(values.sort(sorter));
    }
}

function interpolate(table, val, reverse) {
    let lo = 0;
    let hi = table.length - 1;
    let prevSource, nextSource, prevTarget, nextTarget;
    if (reverse) {
        if (val >= table[lo].pos && val <= table[hi].pos) {
            ({ lo, hi } = _lookupByKey(table, 'pos', val));
        }
        ({ pos: prevSource, time: prevTarget } = table[lo]);
        ({ pos: nextSource, time: nextTarget } = table[hi]);
    } else {
        if (val >= table[lo].time && val <= table[hi].time) {
            ({ lo, hi } = _lookupByKey(table, 'time', val));
        }
        ({ time: prevSource, pos: prevTarget } = table[lo]);
        ({ time: nextSource, pos: nextTarget } = table[hi]);
    }
    const span = nextSource - prevSource;
    return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}
class TimeSeriesScale extends TimeScale {
    static id = 'timeseries';
    static defaults = TimeScale.defaults;
    constructor(props) {
        super(props);
        this._table = [];
        this._minPos = undefined;
        this._tableRange = undefined;
    }
    initOffsets() {
        const timestamps = this._getTimestampsForTable();
        const table = this._table = this.buildLookupTable(timestamps);
        this._minPos = interpolate(table, this.min);
        this._tableRange = interpolate(table, this.max) - this._minPos;
        super.initOffsets(timestamps);
    }
    buildLookupTable(timestamps) {
        const { min, max } = this;
        const items = [];
        const table = [];
        let i, ilen, prev, curr, next;
        for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
            curr = timestamps[i];
            if (curr >= min && curr <= max) {
                items.push(curr);
            }
        }
        if (items.length < 2) {
            return [
                {
                    time: min,
                    pos: 0
                },
                {
                    time: max,
                    pos: 1
                }
            ];
        }
        for (i = 0, ilen = items.length; i < ilen; ++i) {
            next = items[i + 1];
            prev = items[i - 1];
            curr = items[i];
            if (Math.round((next + prev) / 2) !== curr) {
                table.push({
                    time: curr,
                    pos: i / (ilen - 1)
                });
            }
        }
        return table;
    }
    _generate() {
        const min = this.min;
        const max = this.max;
        let timestamps = super.getDataTimestamps();
        if (!timestamps.includes(min) || !timestamps.length) {
            timestamps.splice(0, 0, min);
        }
        if (!timestamps.includes(max) || timestamps.length === 1) {
            timestamps.push(max);
        }
        return timestamps.sort((a, b) => a - b);
    }
    _getTimestampsForTable() {
        let timestamps = this._cache.all || [];
        if (timestamps.length) {
            return timestamps;
        }
        const data = this.getDataTimestamps();
        const label = this.getLabelTimestamps();
        if (data.length && label.length) {
            timestamps = this.normalize(data.concat(label));
        } else {
            timestamps = data.length ? data : label;
        }
        timestamps = this._cache.all = timestamps;
        return timestamps;
    }
    getDecimalForValue(value) {
        return (interpolate(this._table, value) - this._minPos) / this._tableRange;
    }
    getValueForPixel(pixel) {
        const offsets = this._offsets;
        const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
    }
}

var scales = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CategoryScale: CategoryScale,
    LinearScale: LinearScale,
    LogarithmicScale: LogarithmicScale,
    RadialLinearScale: RadialLinearScale,
    TimeScale: TimeScale,
    TimeSeriesScale: TimeSeriesScale
});

const registerables = [
    controllers,
    elements,
    plugins,
    scales
];

export { Animation, Animations, ArcElement, BarController, BarElement, BasePlatform, BasicPlatform, BubbleController, CategoryScale, Chart, plugin_colors as Colors, DatasetController, plugin_decimation as Decimation, DomPlatform, DoughnutController, Element, index as Filler, Interaction, plugin_legend as Legend, LineController, LineElement, LinearScale, LogarithmicScale, PieController, PointElement, PolarAreaController, RadarController, RadialLinearScale, Scale, ScatterController, plugin_subtitle as SubTitle, Ticks, TimeScale, TimeSeriesScale, plugin_title as Title, plugin_tooltip as Tooltip, adapters as _adapters, _detectPlatform, animator, controllers, defaults, elements, layouts, plugins, registerables, registry, scales };
//# sourceMappingURL=chart.js.map