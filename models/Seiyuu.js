module.exports = (sequelize, DataTypes) => {
  return sequelize.define('seiyuu', {
      franchise: {
          type: DataTypes.STRING,
      },
      image_color: {
          type: DataTypes.STRING,
      },
      seiyuu_name: {
        type: DataTypes.STRING,
      },
      nickname: {
        type: DataTypes.STRING,
      },
      nick_query: {
        type: DataTypes.STRING,
      },
      artist_name: {
        type: DataTypes.STRING,
      },
      character: {
        type: DataTypes.STRING,
      },
      character_image: {
        type: DataTypes.STRING,
      },
      birthday: {
        type: DataTypes.STRING,
      },
      birthplace: {
        type: DataTypes.STRING,
      },
      twitter_account: {
        type: DataTypes.STRING,
      },
      other_media: {
        type: DataTypes.STRING,
      },
      other_media_url: {
        type: DataTypes.STRING,
      },
      blog: {
        type: DataTypes.STRING,
      },
      blog_url: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
      },
      website_url: {
        type: DataTypes.STRING,
      },
      agency: {
        type: DataTypes.STRING,
      },
      agency_url: {
        type: DataTypes.STRING,
      },
      mal_image: {
        type: DataTypes.STRING,
      },
      other_image: {
        type: DataTypes.TEXT,
      },
      mal_page: {
        type: DataTypes.STRING,
      },
      skills: {
        type: DataTypes.TEXT,
      },
      hobbies: {
        type: DataTypes.TEXT,
      },
      fun_facts: {
        type: DataTypes.TEXT,
      },
  }, {
      timestamps: false,
  });
};