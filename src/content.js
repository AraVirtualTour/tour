const locationContent = [
    { id: '001', time: 20, required: false, title: 'DummyContent1',             src: '001_0_20.jpg' },
    { id: '002', time: 20, required: true,  title: 'Dummy Image 2 Wowee big!',  src: '002_1_20.jpg' },
    { id: '003', time: 20, required: true,  title: 'Intro Text',                src: '003_1_20.txt' },
    { id: '004', time: 0,  required: true,  title: 'Link 1',                    src: '004_1_0.link' },
    { id: '005', time: 40, required: true,  title: 'Pano',                      src: '005_1_40_pano.jpg' },
    { id: '006', time: 0,  required: false, title: 'Link 2',                    src: '006_0_0.link' },
    { id: '007', time: 0,  required: false, title: 'Audio 1',                   src: '007_0_0.wav' },
    { id: '008', time: 0,  required: true,  title: 'Mean Recording',            src: '008_1_0.wav' },
    { id: '009', time: 0,  required: true,  title: 'Based Subtitles',           src: '009_1_0.wav' }
    //{ id: '010', time: 0,  required: false, title: '',                          src: '010_0_0.ass' }
];

function locationContentLoader() {
  return locationContent;
}

export default locationContentLoader;
