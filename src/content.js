const content = [
    { id: '001', time: 20, required: false, title: 'DummyContent1',             src: './content/001_0_20.jpg' },
    { id: '002', time: 20, required: true,  title: 'Dummy Image 2 Wowee big!',  src: './content/002_1_20.jpg' },
    { id: '003', time: 20, required: true,  title: 'Intro Text',                src: './content/003_1_20.txt' },
    { id: '004', time: 0,  required: true,  title: '',                          src: './content/004_1_0.link' },
    { id: '005', time: 40, required: true,  title: 'Pano',                      src: './content/005_1_40_pano.jpg' },
    { id: '006', time: 0,  required: false, title: '',                          src: './content/006_0_0.link' },
    { id: '007', time: 0,  required: false, title: '',                          src: './content/007_0_0.wav' },
    { id: '008', time: 0,  required: true,  title: 'Mean Recording',            src: './content/008_1_0.wav' },
    { id: '009', time: 0,  required: true,  title: 'Based Subtitles',           src: './content/009_1_0.wav' },
    { id: '010', time: 0,  required: false, title: '',                          src: './content/010_0_0.ass' }
];

function contentLoader() {
  return content;
}

export default contentLoader;
