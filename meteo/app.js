// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: ghippoda <marvin@42.fr>                    +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2017/11/05 16:06:26 by ghippoda          #+#    #+#             //
//   Updated: 2017/11/05 16:10:52 by ghippoda         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

var city = "Paris";

var wearther = require('./tdn_weather');

wearther.get("Paris");
